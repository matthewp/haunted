cd artifacts
mkdir -p ../tmp
mv * ../tmp
cd ../tmp
tar -cvzpf artifacts.tar.gz *
mv artifacts.tar.gz ../artifacts.tar.gz
cd ..
tar -xvzpf artifacts.tar.gz
rm -rf artifacts
rm -rf tmp
rm -f artifacts.tar.gz