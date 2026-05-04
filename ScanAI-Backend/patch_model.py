import h5py
import json

model_path = 'model/feature_extractor_model.h5'

def patch_h5_file(path):
    try:
        with h5py.File(path, 'a') as f:
            if 'model_config' in f.attrs:
                # In Python 3, we check if it's bytes or str
                config_raw = f.attrs['model_config']
                if isinstance(config_raw, bytes):
                    config_raw = config_raw.decode('utf-8')
                
                config = json.loads(config_raw)
                
                # 1. Remove 'batch_shape' to fix the Deserialization error
                layers = config['config']['layers']
                for layer in layers:
                    if 'batch_shape' in layer['config']:
                        del layer['config']['batch_shape']
                        print(f"✅ Removed batch_shape: {layer['name']}")
                
                # 2. Fix the 'function_type' error (Keras 3 compatibility)
                # We remove the training_config if it's causing issues
                if 'training_config' in f.attrs:
                    del f.attrs['training_config']
                    print("✅ Removed complex training_config to fix 'function_type' error.")

                # Save back as encoded bytes
                f.attrs['model_config'] = json.dumps(config).encode('utf-8')
                print("\n🎉 Success! Model patched.")
            else:
                print("❌ No model_config found.")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    patch_h5_file(model_path)