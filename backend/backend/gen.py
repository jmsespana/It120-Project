from cryptography.fernet import Fernet

def generate_key():
    """Generates a new Fernet key and saves it to a file."""
    key = Fernet.generate_key()
    with open("key.key", "wb") as key_file:
        key_file.write(key)
    print("Key generated and saved to 'key.key'")

if __name__ == "__main__":
    # Run the key generator
    generate_key()
