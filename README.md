# Lû — página oficial

Site estático para apresentar o Lû, indicar a versão Android e explicar a instalação. O APK é publicado separadamente como asset de uma GitHub Release; o arquivo binário não pertence a este repositório.

## Executar localmente

Na raiz do clone:

```powershell
python -m http.server 8000
```

Abra `http://localhost:8000/`. Encerre o servidor com `Ctrl+C`.

## Publicar no GitHub Pages

O repositório público é `JoaoPicoli/L-`. O site estático é servido a partir da raiz, com `index.html` e `.nojekyll` na raiz. Em **Settings → Pages**, escolha **Deploy from a branch**, branch `main`, pasta `/(root)`.

Os caminhos de HTML, CSS, JavaScript, fontes e imagens são relativos, para funcionar em `https://joaopicoli.github.io/L-/`. A metatag `noindex` pede aos mecanismos de busca compatíveis que não indexem a página; ela continua pública e acessível a qualquer pessoa.

## Atualizar a versão do aplicativo

Edite `scripts/release-config.js`, que centraliza versão, package ID, compatibilidade, tamanho, hashes e URL do asset `Lu.apk`. Mantenha `available: false` enquanto não existir uma GitHub Release verificada com esse nome. Após publicar e conferir o APK e a URL, atualize `available` para `true`. O botão só é habilitado para um endereço HTTPS.

Para versões futuras, atualize os metadados e hashes junto com o asset da release. Preserve o nome `Lu.apk` para o endereço `/releases/latest/download/Lu.apk` continuar estável.

## Estrutura

- `index.html`: apresentação, versão/download e instalação.
- `styles/`: tokens, layout e movimento reduzido.
- `scripts/`: navegação, interação do mascote e configuração centralizada da release.
- `assets/mascots/`: mascotes e ilustração usados na página.
- `assets/fonts/`: fontes locais e licenças SIL Open Font License.

O site não usa backend, Supabase, analytics ou scripts externos. Referências, SVGs de acervo, previews e o Bunny Hop não são necessários para a página publicada e permanecem locais; não os adicione ao Git. Os arquivos de fonte incluem as licenças necessárias para distribuição.
