Add-Type -AssemblyName System.Drawing

function Create-PwaIcon {
    param(
        [string]$sourcePath,
        [string]$destPath,
        [int]$size,
        [bool]$isMaskable
    )
    
    $srcImg = [System.Drawing.Image]::FromFile($sourcePath)
    $bmp = New-Object System.Drawing.Bitmap $size, $size
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    
    # Fondo elegante Cockpit #07080a
    $bgBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 7, 8, 10))
    $g.FillRectangle($bgBrush, 0, 0, $size, $size)
    
    # Proporción con margen de seguridad
    $paddingRatio = if ($isMaskable) { 0.20 } else { 0.10 }
    $maxW = $size * (1 - ($paddingRatio * 2))
    $maxH = $size * (1 - ($paddingRatio * 2))
    
    $ratioW = $maxW / $srcImg.Width
    $ratioH = $maxH / $srcImg.Height
    $scale = [Math]::Min($ratioW, $ratioH)
    
    $targetW = [int]($srcImg.Width * $scale)
    $targetH = [int]($srcImg.Height * $scale)
    
    $posX = [int](($size - $targetW) / 2)
    $posY = [int](($size - $targetH) / 2)
    
    $g.DrawImage($srcImg, $posX, $posY, $targetW, $targetH)
    
    $bmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
    
    $g.Dispose()
    $bmp.Dispose()
    $srcImg.Dispose()
    $bgBrush.Dispose()
    Write-Host "Generated: $destPath ($size x $size)"
}

$logo = "$PSScriptRoot\..\public\logo-vipcar.png"
Create-PwaIcon -sourcePath $logo -destPath "$PSScriptRoot\..\public\pwa-192x192.png" -size 192 -isMaskable $false
Create-PwaIcon -sourcePath $logo -destPath "$PSScriptRoot\..\public\pwa-512x512.png" -size 512 -isMaskable $false
Create-PwaIcon -sourcePath $logo -destPath "$PSScriptRoot\..\public\pwa-maskable-192x192.png" -size 192 -isMaskable $true
Create-PwaIcon -sourcePath $logo -destPath "$PSScriptRoot\..\public\pwa-maskable-512x512.png" -size 512 -isMaskable $true
Create-PwaIcon -sourcePath $logo -destPath "$PSScriptRoot\..\public\apple-touch-icon.png" -size 180 -isMaskable $false
