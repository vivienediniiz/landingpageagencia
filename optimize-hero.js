import imagemin from 'imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

(async () => {
  try {
    console.log('🖼️  Otimizando foto principal (viviene.png)...');

    // Converter para WebP de alta qualidade
    const inputPath = 'public/viviene.png';
    const outputPath = 'public/viviene.webp';

    await sharp(inputPath)
      .webp({ quality: 80 })
      .toFile(outputPath);

    const stats = fs.statSync(outputPath);
    const inputStats = fs.statSync(inputPath);

    console.log(`✅ WebP criado com sucesso!`);
    console.log(`  Original (PNG): ${(inputStats.size / 1024 / 1024).toFixed(2)}MB`);
    console.log(`  WebP: ${(stats.size / 1024 / 1024).toFixed(2)}MB`);
    console.log(`  Redução: ${(100 - (stats.size / inputStats.size) * 100).toFixed(1)}%`);

    // Otimizar PNG com qualidade mais agressiva
    await imagemin(['public/viviene.png'], {
      destination: 'public',
      plugins: [
        imageminPngquant({
          quality: [0.5, 0.7]
        })
      ]
    });

    const optimizedStats = fs.statSync(inputPath);
    console.log(`\n✅ PNG otimizado com sucesso!`);
    console.log(`  Tamanho: ${(optimizedStats.size / 1024 / 1024).toFixed(2)}MB`);
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
})();
