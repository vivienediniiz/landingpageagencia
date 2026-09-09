import imagemin from 'imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';

(async () => {
  try {
    console.log('🖼️  Otimizando imagens...');

    const files = await imagemin(['public/**/*.{jpg,png}'], {
      destination: 'public',
      plugins: [
        imageminMozjpeg({ quality: 80 }),
        imageminPngquant({
          quality: [0.6, 0.8]
        })
      ]
    });

    if (files.length > 0) {
      console.log(`✅ ${files.length} imagens otimizadas com sucesso!`);
      files.forEach(file => {
        console.log(`  • ${file}`);
      });
    } else {
      console.log('ℹ️  Nenhuma imagem para otimizar.');
    }
  } catch (error) {
    console.error('❌ Erro ao otimizar imagens:', error);
    process.exit(1);
  }
})();
