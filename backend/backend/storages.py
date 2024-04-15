from storages.backends.azure_storage import AzureStorage

class AzureMediaStorage(AzureStorage):
  account_name = "c0027816devproject"
  account_key = "qKks6N3q0GmL51XCuwXNnEWvAoWr4W+S3IUWCfXxnnEKIXnzvdEgfa+gGoWeum1bbAp6b5cMkkG1+AStI6GwrQ=="
  azure_container = "media"
  expiration_secs = None

class AzureStaticStorage(AzureStorage):
  account_name = "c0027816devproject"
  account_key = "qKks6N3q0GmL51XCuwXNnEWvAoWr4W+S3IUWCfXxnnEKIXnzvdEgfa+gGoWeum1bbAp6b5cMkkG1+AStI6GwrQ=="
  azure_container = "static"
  expiration_secs = None