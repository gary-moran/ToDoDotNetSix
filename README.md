## Install Client Frameworks

Open terminal ToDoDotNetSix-master\ToDoDotNetSixWeb\ClientApp run: npm install --force

## How to Access the MS SQL Database

(localdb)\MSSQLLocalDB
Windows Authentication

## Ensure SSL Cert Path Exists

~~~%APPDATA%\ASP.NET\https~~~

# Ensure ASP.NET HTTPS certificate folder exists
$httpsPath = "$env:APPDATA\ASP.NET\https"

if (!(Test-Path $httpsPath)) {
    Write-Host "Creating ASP.NET HTTPS certificate directory..."
    New-Item -ItemType Directory -Path $httpsPath | Out-Null
}

# Clean any broken certificates
Write-Host "Cleaning old development certificates..."
dotnet dev-certs https --clean

# Generate and trust a new development certificate
Write-Host "Generating and trusting new development certificate..."
dotnet dev-certs https --trust

Write-Host ""
Write-Host "Setup complete."
Write-Host "You can now run the Web project normally."
