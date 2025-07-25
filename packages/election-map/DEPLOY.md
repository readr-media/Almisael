# Deploy CLI Documentation

The deploy CLI is an interactive tool for building and deploying the Taiwan Election Map application to multiple news organizations and environments.

## Quick Start

```bash
# Run the interactive deployment
yarn deploy

# Run in dry-run mode (build only, no GCS deployment)
yarn deploy:dry-run

# Or directly
node deploy.js

# Or with environment variable
DRY_RUN=true node deploy.js
```

## Features

- **Interactive Selection**: Choose organizations and environments via checkbox prompts
- **Dry-Run Mode**: Test deployments without actually uploading to GCS
- **Sequential Processing**: Builds run sequentially to avoid conflicts
- **Multi-Organization Support**: Deploy to 4 news organizations
- **Environment Management**: Separate dev and prod configurations
- **Structured Logging**: Clear, colored output with context
- **Error Handling**: Comprehensive error reporting and recovery
- **Configuration Management**: External JSON configuration for easy maintenance

## Supported Organizations

- **readr-media**: READr台灣媒體
- **mirror-media**: 鏡週刊
- **mirror-tv**: 鏡新聞
- **mirror-daily**: 鏡報

## Supported Environments

- **dev**: Development environment with no-cache headers
- **prod**: Production environment

## Usage Examples

### Deploy to Single Organization

1. Run `yarn deploy`
2. Select organization (e.g., `readr-media`)
3. Select environment (e.g., `dev`)
4. The system will:
   - Generate `consts/config.js` for the selected org/env
   - Build the Next.js application
   - Export static files to `readr-media-dev-out/`
   - Deploy to GCS bucket: `gs://readr-coverage/project/3/dev-taiwan-elections`

### Deploy to Multiple Organizations

1. Run `yarn deploy`
2. Select multiple organizations using spacebar
3. Select one or more environments
4. All combinations will be processed sequentially to avoid build conflicts

### Test Deployment (Dry-Run Mode)

To test your deployment without actually uploading to GCS:

```bash
# Interactive mode with dry-run prompt
yarn deploy

# Force dry-run mode
yarn deploy:dry-run

# With environment variable
DRY_RUN=true yarn deploy
```

In dry-run mode:
- Configuration files are generated normally
- Next.js builds and exports are executed
- Output directories are created with static files
- GCS deployment is skipped with simulation log messages
- All validation and error checking still occurs

### Example Output

```
? Select organizations (use space bar to select): readr-media, mirror-media
? Select environments (use space bar to select): dev, prod

✓ Generated config.js for readr-media (dev)
✓ Build for readr-media (dev) completed successfully
✓ Deployed readr-media (dev) to GCS successfully

✓ Generated config.js for readr-media (prod)  
✓ Build for readr-media (prod) completed successfully
✓ Deployed readr-media (prod) to GCS successfully

✓ Generated config.js for mirror-media (dev)
✓ Build for mirror-media (dev) completed successfully
✓ Deployed mirror-media (dev) to GCS successfully

✓ Generated config.js for mirror-media (prod)
✓ Build for mirror-media (prod) completed successfully
✓ Deployed mirror-media (prod) to GCS successfully

Deployment Summary:
- Total: 4
- Successful: 4
- Failed: 0
- Organizations: readr-media, mirror-media
- Environments: dev, prod

✓ All deployments completed successfully!
```

## Architecture

The deploy CLI uses a service-oriented architecture:

### Services

- **ConfigService**: Manages configuration file generation and deployment settings
- **BuildService**: Handles Next.js build and export operations  
- **GCSService**: Manages Google Cloud Storage deployments
- **ValidationService**: Handles user input validation

### Utilities

- **Logger**: Structured logging with colored output
- **ErrorHandler**: Centralized error handling with custom error types
- **CommandBuilder**: Reusable command construction utilities

## Configuration

All deployment configurations are stored in `config/deployment-config.json`:

```json
{
  "organizations": {
    "readr-media": {
      "dev": {
        "bucket": "gs://readr-coverage/project/3/dev-taiwan-elections",
        "cacheControl": "no-store"
      },
      "prod": {
        "bucket": "gs://readr-coverage/project/3/taiwan-elections", 
        "cacheControl": "no-store"
      }
    }
  }
}
```

## Output Directories

Each org/env combination creates its own output directory:

- `readr-media-dev-out/`
- `readr-media-prod-out/`
- `mirror-media-dev-out/`
- `mirror-media-prod-out/`
- `mirror-tv-dev-out/`
- `mirror-tv-prod-out/`
- `mirror-daily-dev-out/`
- `mirror-daily-prod-out/`

## Prerequisites

1. **Node.js**: Version 16 or higher
2. **Google Cloud SDK**: `gsutil` command must be available
3. **Authentication**: Valid GCS credentials for target buckets
4. **Dependencies**: Run `yarn install` to install required packages

## Testing

The deploy CLI includes comprehensive test coverage:

```bash
# Run all deploy tests
yarn test:deploy

# Run integration tests only
yarn test:integration

# Run deployment regression tests
yarn test:deploy-regression
```

## Error Handling

The CLI provides detailed error information:

- **Configuration Errors**: Invalid org/env combinations
- **Build Errors**: Next.js build failures with stderr output
- **GCS Errors**: Deployment failures with bucket information
- **Validation Errors**: User input validation failures

## Troubleshooting

### Common Issues

1. **GCS Authentication**
   ```bash
   # Login to GCS
   gcloud auth login
   
   # Set project
   gcloud config set project YOUR_PROJECT_ID
   ```

2. **Permission Denied**
   - Verify you have write access to target GCS buckets
   - Check your GCS service account permissions

3. **Build Failures**
   - Ensure all dependencies are installed: `yarn install`
   - Check for TypeScript/lint errors: `yarn lint`

4. **Out of Memory**
   - Increase Node.js memory: `NODE_OPTIONS="--max-old-space-size=4096" yarn deploy`

### Debug Mode

For detailed logging, the CLI outputs structured information including:
- Build command execution details
- GCS deployment progress
- Error context and stack traces

## Migration from Legacy Deploy

The new CLI maintains 100% backward compatibility with the previous `deploy.js` while adding:

- Better error handling and recovery
- Parallel processing for faster deployments
- Structured logging for easier debugging
- External configuration for maintainability
- Comprehensive test coverage

## Development

To modify or extend the deployment system:

1. **Add New Organization**: Update `config/deployment-config.json`
2. **Modify Build Process**: Edit `services/build-service.js`
3. **Change GCS Logic**: Update `services/gcs-service.js`
4. **Add Validation**: Extend `services/validation-service.js`

All changes should include corresponding tests in the `__tests__/deploy/` directory.