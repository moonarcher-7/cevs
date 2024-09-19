from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import padding
from os import urandom
import base64

# Example vote
vote = "Candidate A"

# Password for key derivation (ideally, a more secure process would be used for key management)
password = b"strong_password"

# Generate a salt for the key derivation
salt = urandom(16)

# Derive the AES key from the password
kdf = PBKDF2HMAC(
    algorithm=hashes.SHA256(),
    length=32,
    salt=salt,
    iterations=100000,
    backend=default_backend()
)
key = kdf.derive(password)

# Generate an IV (Initialization Vector) for AES CBC mode
iv = urandom(16)

# Create an AES Cipher object with CBC mode
cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())

# Encrypt the vote
encryptor = cipher.encryptor()

# Pad the vote data (AES requires input to be a multiple of block size)
padder = padding.PKCS7(algorithms.AES.block_size).padder()
padded_data = padder.update(vote.encode()) + padder.finalize()

# Perform the encryption
encrypted_vote = encryptor.update(padded_data) + encryptor.finalize()

# Encode the encrypted vote, IV, and salt in base64 for storage or transmission
encrypted_vote_base64 = base64.b64encode(salt + iv + encrypted_vote).decode()

print(f"Encrypted vote: {encrypted_vote_base64}")

# To decrypt:
def decrypt_vote(encrypted_vote_base64, password):
    encrypted_data = base64.b64decode(encrypted_vote_base64)

    # Extract salt, IV, and ciphertext from the encoded data
    salt = encrypted_data[:16]
    iv = encrypted_data[16:32]
    ciphertext = encrypted_data[32:]
    # Derive the AES key again using the same password and salt
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=100000,
        backend=default_backend()
    )
    key = kdf.derive(password)
    # Create a Cipher object for decryption
    cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
    decryptor = cipher.decryptor()
    # Decrypt the ciphertext
    decrypted_padded_data = decryptor.update(ciphertext) + decryptor.finalize()
    # Unpad the decrypted data
    unpadder = padding.PKCS7(algorithms.AES.block_size).unpadder()
    decrypted_vote = unpadder.update(decrypted_padded_data) + unpadder.finalize()
    return decrypted_vote.decode()
# Example decryption
decrypted_vote = decrypt_vote(encrypted_vote_base64, password)
print(f"Decrypted vote: {decrypted_vote}")
