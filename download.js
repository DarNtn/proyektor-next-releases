const downloadButton = document.querySelector('#download-windows')
const downloadStatus = document.querySelector('#download-status')

downloadButton?.addEventListener('click', async () => {
  downloadButton.disabled = true
  downloadStatus.textContent = 'Buscando el instalador más reciente…'

  try {
    const response = await fetch(
      'https://api.github.com/repos/DarNtn/proyektor-next-releases/releases/latest',
      { headers: { Accept: 'application/vnd.github+json' } },
    )
    if (!response.ok) throw new Error('No se pudo consultar la última versión.')

    const release = await response.json()
    const installer = release.assets?.find(
      (asset) => /x64-setup\.exe$/i.test(asset.name),
    )
    if (
      !installer?.browser_download_url ||
      !installer.browser_download_url.startsWith(
        'https://github.com/DarNtn/proyektor-next-releases/releases/download/',
      )
    ) {
      throw new Error('La última versión no contiene un instalador para Windows de 64 bits.')
    }

    downloadStatus.textContent = `Descargando ${installer.name}…`
    window.location.assign(installer.browser_download_url)
  } catch (error) {
    downloadStatus.textContent =
      error instanceof Error
        ? `${error.message} Inténtalo nuevamente en unos momentos.`
        : 'No se pudo iniciar la descarga. Inténtalo nuevamente en unos momentos.'
  } finally {
    downloadButton.disabled = false
  }
})
