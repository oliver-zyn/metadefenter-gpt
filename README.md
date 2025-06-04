# MetaDefender - Sanitizador de Metadados

MetaDefender é uma aplicação web desenvolvida em React e TypeScript que permite analisar e
remover metadados de arquivos de imagem (JPEG/PNG) e documentos PDF diretamente
no navegador. Todo o processamento é realizado localmente, garantindo que nenhum
conteúdo seja enviado para servidores externos.

## Tecnologias Utilizadas

- **React** 19
- **TypeScript**
- **Vite** para o empacotamento e servidor de desenvolvimento
- **Tailwind CSS** para estilização
- **ExifReader** para leitura de metadados de imagens
- **pdf-lib** para manipulação básica de PDFs
- **lucide-react** para os ícones da interface

## Como Funciona

1. O usuário faz o upload de uma imagem ou PDF.
2. Os metadados são extraídos no lado do cliente (imagem via `ExifReader` e PDF
   via `pdf-lib`).
3. Metadados considerados sensíveis (como informações de GPS ou autor) são
   destacados na interface.
4. Ao acionar **Sanitizar**, é gerada uma cópia do arquivo sem metadados:
   - Imagens são redesenhadas em um canvas, eliminando informações embutidas.
   - PDFs recebem uma nova versão do arquivo. A remoção de todos os metadados
     pode variar conforme a estrutura do documento.
5. É exibido um resumo com hashes SHA-256, quantidade de metadados removidos e um
   certificado de sanitização que pode ser baixado junto ao arquivo limpo.

## Execução do Projeto

```bash
npm install       # instala as dependências
npm run dev       # inicia o servidor de desenvolvimento
```

Após executar `npm run dev`, acesse `http://localhost:5173` no navegador. Para
gerar uma versão de produção utilize:

```bash
npm run build
npm run preview   # visualiza o build gerado
```

## Estrutura do Código

- `src/App.tsx` – componente principal e fluxo de upload/sanitização.
- `src/utils/metadataExtractor.ts` – funções de extração de metadados.
- `src/utils/fileSanitizer.ts` – cria as cópias sanitizadas dos arquivos.
- `src/utils/fileHelpers.ts` – utilitários como hashing e downloads.
- `src/types` – definições TypeScript utilizadas no app.
- `public/` – arquivos estáticos (imagens e ícones).

## Privacidade

O MetaDefender não realiza upload de arquivos para nenhum servidor. Todas as
operações ocorrem apenas no seu navegador, mantendo seus documentos em
segurança e privacidade total.

## Contribuição

Pull requests são bem-vindos! Antes de enviar, utilize `npm run lint` para
verificar o estilo do código.
