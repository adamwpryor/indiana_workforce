import os
from typing import Optional

def load_secure_key(generic_name: str, specific_name: Optional[str] = None, default: Optional[str] = None) -> str:
    """Retrieves a secret key from the environment using the Zero-Trust protocol.

    Prioritizes standard environment variables (for production/collaboration) but
    falls back to user-specific secure variables (Windows Vault) to avoid local
    .env storage of secrets.

    Args:
        generic_name (str): The standard environment variable name (e.g., 'OPENAI_API_KEY').
        specific_name (str, optional): The user-specific secure variable name (e.g., 'ACE_OPENAI_KEY').
        default (str, optional): A default value to return if the key is not found. Defaults to None.

    Returns:
        str: The retrieved secret key.

    Raises:
        ValueError: If the key is not found in either location and no default is provided.
    """
    # 1. Check for the standard name (e.g. if a friend runs this with their own .env)
    key = os.environ.get(generic_name)
    
    # 2. If missing, check your Secure Windows Vault (if a different name is provided)
    if not key and specific_name and specific_name != generic_name:
        key = os.environ.get(specific_name)
        
    # 3. Use default if provided
    if not key and default is not None:
        return default
        
    # 4. Security Failure: Crash if neither exists
    if not key:
        error_msg = f"Security Alert: Could not find {generic_name}"
        if specific_name and specific_name != generic_name:
            error_msg += f" or {specific_name}"
        raise ValueError(f"{error_msg} in environment.")
    
    return key
