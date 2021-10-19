// Nav links highlighting
$(`a[href="${window.location.pathname}"].nav-link`).addClass("active");

// FilePond
FilePond.registerPlugin(
    FilePondPluginFileEncode,
    FilePondPluginImagePreview,
    FilePondPluginImageResize
    );
FilePond.setOptions({
    stylePanelAspectRatio: 150 / 100,
    imageResizeTargetWidth: 100,
    imageResizeTargetHeight: 150
})
FilePond.parse(document.body);