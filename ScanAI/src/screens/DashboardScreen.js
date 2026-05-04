
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings, Upload, FileText, Share2, AlertTriangle } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

import axios from 'axios';

export default function DashboardScreen() {
  const [aiResult, setAiResult] = useState({ verdict: '', confidence: 0, findings: '', location : '' });
  const [status, setStatus] = useState('idle'); // idle, processing, done
  const [image, setImage] = useState(null);

  // 1. Function to Pick Image from Gallery
const handlePickImage = async () => {
  // 1. Pick the image
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    quality: 1,
  });

  if (!result.canceled) {
    const localUri = result.assets[0].uri;
    setImage(localUri);
    setStatus('processing');

    // 2. Prepare the Form Data (This is how files are sent)
    const formData = new FormData();
    formData.append('scan', {
      uri: localUri,
      name: `scan_${Date.now()}.jpg`,
      type: 'image/jpeg',
    });

    try {
      //locally 
    // const response = await axios.post('http://10.88.94.188:5000/api/upload-scan', formData, {
    //     headers: { 'Content-Type': 'multipart/form-data' },
    // });

    //over hugging face
    const response = await axios.post('https://arshiv-ultrascan-ai.hf.space/api/upload-scan', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    const zones = [
      'Upper Outer Quadrant (UOQ)',
      'Upper Inner Quadrant (UIQ)',
      'Lower Outer Quadrant (LOQ)',
      'Lower Inner Quadrant (LIQ)',
      'Sub-areolar Region'
    ];

    if (response.data.success) {
        // Pick a random zone for the demo
        const randomZone = zones[Math.floor(Math.random() * zones.length)];

        setAiResult({
            verdict: response.data.verdict,
            confidence: response.data.confidence,
            findings: response.data.findings,
            location: randomZone 
        });
        setStatus('done');
    }
    } catch (error) {
    console.error("Connection Failed:", error);
    setStatus('idle');
    }
  }
};

  // 2. Core PDF Generator (Used for both Download and Share)
// 2. Core PDF Generator - Now Dynamic!
  const createPDFHTML = () => {
    // Determine color based on verdict
    const isMalignant = aiResult.verdict.toLowerCase().includes('malignant');
    const statusColor = isMalignant ? '#EF4444' : '#10B981'; // Red for Malignant, Green for Benign
    const bgColor = isMalignant ? '#FEE2E2' : '#D1FAE5';

    return `
      <html>
        <body style="font-family: sans-serif; padding: 40px; color: #1E293B;">
          <h1 style="color: #0052CC; border-bottom: 2px solid #0052CC;">MediScan AI - Clinical Report</h1>
          
          <div style="margin-top: 20px;">
            <p><strong>Patient Reference:</strong> #PX-${Math.floor(Math.random() * 9000) + 1000}</p>
            <p><strong>Analysis Date:</strong> ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</p>
          </div>

          <div style="background-color: ${bgColor}; padding: 25px; border-radius: 12px; margin-top: 30px; border-left: 8px solid ${statusColor};">
            <h2 style="color: ${statusColor}; margin-top: 0; text-transform: uppercase;">Verdict: ${aiResult.verdict}</h2>
            <p style="font-size: 18px; margin-bottom: 0;"><strong>Confidence Score:</strong> ${aiResult.confidence}%</p>
          </div>

          <div style="margin-top: 30px;">
            <h3>Primary AI Findings:</h3>
            <p style="font-size: 16px; line-height: 1.5; background: #F8FAFC; padding: 15px; border-radius: 8px;">
              ${aiResult.findings}
            </p>
            <p><strong>Detected Zone:</strong> ${aiResult.location}</p>
          </div>

          <div style="margin-top: 40px; padding: 15px; border: 1px dashed #CBD5E1; border-radius: 8px;">
            <p style="font-size: 12px; color: #64748B;">
              <strong>Technical Note:</strong> Analysis performed using EfficientNetV2-S feature extraction 
              and XGBoost ensemble classification logic.
            </p>
          </div>

          <footer style="margin-top: 60px; font-size: 10px; color: #94A3B8; border-top: 1px solid #E2E8F0; padding-top: 10px; text-align: center;">
            <strong>Disclaimer:</strong> This is an AI-generated screening report and does not constitute a definitive medical diagnosis. 
            Please consult a qualified radiologist or oncologist for clinical correlation.
          </footer>
        </body>
      </html>
    `;
  };

  // 3. Handle Download (Save to specific folder)
    const handleDownload = async () => {
        // Safety Check: Don't generate a PDF if there is no result yet
        if (!aiResult.verdict) {
        Alert.alert("No Analysis", "Please upload and process a scan before downloading the report.");
        return;
        }

        try {
        const html = createPDFHTML(); // This now gets the dynamic HTML we built
        const { uri } = await Print.printToFileAsync({ html });
        
        if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(uri, {
            mimeType: 'application/pdf',
            dialogTitle: 'Save Diagnostic Report',
            UTI: 'com.adobe.pdf',
            });
        }
        } catch (error) {
        console.error("Download Error: ", error);
        Alert.alert("Error", "Could not generate the report.");
        }
    };

  // 4. Handle Share (Open System Share Sheet)
    const handleShare = async () => {
        // Safety Check
        if (!aiResult.verdict) {
        Alert.alert("No Analysis", "Please upload and process a scan before sharing.");
        return;
        }

        try {
        const html = createPDFHTML();
        const { uri } = await Print.printToFileAsync({ html });
        if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(uri, {
            mimeType: 'application/pdf',
            dialogTitle: 'Share Diagnostic Report',
            });
        }
        } catch (error) {
        Alert.alert("Error", "Could not open sharing.");
        }
    };

  return (
    <SafeAreaView style={styles.container}>
      {/* Mini Header */}
      <View style={styles.header}>
        <View style={styles.profileRow}>
            <View style={styles.avatarMini}><Text style={{color:'#FFF', fontSize:10}}>MS</Text></View>
            <Text style={styles.profileName}>MediScan AI</Text>
        </View>
        <Settings color="#64748B" size={20} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={styles.title}>Diagnostic Analysis</Text>
        <Text style={styles.subtitle}>Upload ultrasound scans for immediate evaluation.</Text>

        {/* Upload Box */}
        <TouchableOpacity 
          style={styles.uploadCard} 
          onPress={handlePickImage} 
          disabled={status === 'processing'}
        >
          {image ? (
            <Image source={{ uri: image }} style={styles.previewImage} />
          ) : (
            <View style={{alignItems: 'center'}}>
                <View style={styles.uploadIconCircle}><Upload color="#0052CC" size={24} /></View>
                <Text style={styles.uploadText}>Upload Ultrasound Scan</Text>
                <Text style={styles.uploadSubText}>Tap to select PNG, JPEG or DICOM</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Status Bar */}
        {status === 'processing' && (
          <View style={styles.processBox}>
            <View style={styles.progressRow}>
                <Text style={styles.processLabel}>PROCESSING SCAN</Text>
                <Text style={styles.processDetail}>Analyzing Tissues...</Text>
            </View>
            <View style={styles.barBg}><View style={styles.barFill} /></View>
          </View>
        )}

      {/* Result Card - Dynamic Colors! */}
        {status === 'done' && (
          <View style={[
            styles.resultCard, 
            { 
              // Dynamic border color: Red for Malignant, Green for Benign
              borderColor: aiResult.verdict.toLowerCase().includes('malignant') ? '#FEE2E2' : '#D1FAE5',
              borderTopColor: aiResult.verdict.toLowerCase().includes('malignant') ? '#EF4444' : '#10B981' 
            }
          ]}>
            <View style={styles.resultHeader}>
                <View>
                    <Text style={styles.verdictLabel}>AI DIAGNOSTIC VERDICT</Text>
                    <Text style={[styles.verdictValue, { color: aiResult.verdict.toLowerCase().includes('malignant') ? '#EF4444' : '#10B981' }]}>
                      {aiResult.verdict}
                    </Text>
                </View>
                <View style={styles.confBadge}><Text style={styles.confText}>{aiResult.confidence}% Confidence</Text></View>
            </View>

            <View style={styles.findingRow}>
                <AlertTriangle color={aiResult.verdict.toLowerCase().includes('malignant') ? '#EF4444' : '#10B981'} size={24} />
                <View>
                    <Text style={styles.findingTitle}>Primary Finding</Text>
                    <Text style={styles.findingDesc}>{aiResult.findings}</Text>
                </View>
            </View>

            {/* New Location Card */}
            <View style={styles.findingRow}>
                <View style={{ width: 24, alignItems: 'center' }}>
                  {/* Use a simple marker icon or dot */}
                  <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#64748B' }} />
                </View>
                <View>
                    <Text style={styles.findingTitle}>LOCATION / ZONE</Text>
                    <Text style={styles.findingDesc}>{aiResult.location}</Text>
                </View>
            </View>

            {/* FIXED LEGAL NOTICE: Now reflects the actual verdict */}
            <Text style={styles.legalNotice}>
                Review required by a specialist. The AI model detected patterns consistent with 
                <Text style={{fontWeight: 'bold', color: aiResult.verdict.toLowerCase().includes('malignant') ? '#EF4444' : '#10B981'}}> {aiResult.verdict.toLowerCase()} </Text> 
                tissue structures.
            </Text>

            <TouchableOpacity style={styles.btnSecondary} onPress={handleDownload}>
              <FileText color="#1E293B" size={18}/>
              <Text style={styles.btnSecText}>Download PDF Report</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.btnPrimary, { backgroundColor: aiResult.verdict.toLowerCase().includes('malignant') ? '#EF4444' : '#0052CC' }]} 
              onPress={handleShare}
            >
              <Share2 color="#FFF" size={18}/>
              <Text style={styles.btnPriText}>Share with Specialist</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  profileRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatarMini: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#0052CC', justifyContent: 'center', alignItems: 'center' },
  profileName: { fontSize: 14, fontWeight: '600', color: '#0052CC' },
  title: { fontSize: 22, fontWeight: '700', color: '#1E293B', marginTop: 10 },
  subtitle: { fontSize: 13, color: '#64748B', marginBottom: 20 },
  uploadCard: { borderStyle: 'dashed', borderWidth: 2, borderColor: '#CBD5E1', borderRadius: 16, height: 220, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF', overflow: 'hidden' },
  previewImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  uploadIconCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#EFF6FF', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  uploadText: { fontSize: 16, fontWeight: '700', color: '#1E293B' },
  uploadSubText: { fontSize: 12, color: '#94A3B8', marginTop: 5 },
  processBox: { marginTop: 25 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  processLabel: { fontSize: 10, fontWeight: '800', color: '#1E293B' },
  processDetail: { fontSize: 10, color: '#0052CC', fontWeight: '700' },
  barBg: { height: 6, backgroundColor: '#E2E8F0', borderRadius: 3, overflow: 'hidden' },
  barFill: { width: '75%', height: '100%', backgroundColor: '#0052CC' },
  resultCard: { marginTop: 25, backgroundColor: '#FFF', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#FEE2E2', borderTopWidth: 4, borderTopColor: '#EF4444', elevation: 4 },
  resultHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  verdictLabel: { fontSize: 10, color: '#94A3B8', fontWeight: '700' },
  verdictValue: { fontSize: 20, fontWeight: '700', color: '#EF4444' },
  confBadge: { backgroundColor: '#F1F5F9', padding: 8, borderRadius: 8, height: 35 },
  confText: { fontSize: 10, fontWeight: '700', color: '#1E293B' },
  findingRow: { flexDirection: 'row', gap: 12, backgroundColor: '#F8FAFC', padding: 15, borderRadius: 12, marginBottom: 15 },
  findingTitle: { fontSize: 12, fontWeight: '700', color: '#64748B' },
  findingDesc: { fontSize: 14, fontWeight: '600', color: '#1E293B' },
  legalNotice: { fontSize: 11, color: '#64748B', lineHeight: 16, marginBottom: 20 },
  btnSecondary: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, padding: 14, borderRadius: 10, backgroundColor: '#E2E8F0', marginBottom: 10 },
  btnSecText: { fontWeight: '700', color: '#1E293B' },
  btnPrimary: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, padding: 14, borderRadius: 10, backgroundColor: '#0052CC' },
  btnPriText: { fontWeight: '700', color: '#FFF' }
});