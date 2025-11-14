@echo off
echo Building the package...
call npm run build

echo Running type checking...
call npm run typecheck

echo Creating package...
call npm pack

echo Package created successfully!
echo To publish to npm, run: npm publish
echo To publish with public access: npm publish --access public