echo "Enter release version: " 

read VERSION

npm --git-tag-version version $VERSION -m "release: v$VERSION"

npm publish --access public --registry https://registry.npmjs.com/

git push origin v$VERSION