#!/bin/bash

# Build and prepare the package for publishing
echo "Building the package..."
npm run build

echo "Running type checking..."
npm run typecheck

echo "Creating package..."
npm pack

echo "Package created successfully!"
echo "To publish to npm, run: npm publish"
echo "To publish with public access: npm publish --access public"