# One-time dev utility: generates placeholder PWA icons (192px, 512px)
# using GDI+ (System.Drawing). Not part of the shipped app.
Add-Type -AssemblyName System.Drawing

function New-AppIcon {
    param(
        [int]$Size,
        [string]$OutPath
    )

    $bmp = New-Object System.Drawing.Bitmap $Size, $Size
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

    # Background: oxblood -> deep red radial-ish fill (edge-to-edge, safe for maskable)
    $rect = New-Object System.Drawing.Rectangle 0, 0, $Size, $Size
    $c1 = [System.Drawing.Color]::FromArgb(255, 122, 31, 43)   # #7a1f2b
    $c2 = [System.Drawing.Color]::FromArgb(255, 74, 15, 26)    # #4a0f1a
    $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $c1, $c2, 45)
    $g.FillRectangle($brush, $rect)

    # Center safe-zone bounds (~66% of canvas) for the glyph
    $cx = $Size / 2.0
    $cy = $Size / 2.0
    $scale = $Size / 512.0

    $white = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)
    $accent = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 232, 169, 59)) # golden #e8a93b

    # Thermometer stem (rounded rect)
    $stemW = 46 * $scale
    $stemH = 230 * $scale
    $stemX = $cx - $stemW / 2
    $stemY = $cy - 190 * $scale
    $stemRect = New-Object System.Drawing.RectangleF $stemX, $stemY, $stemW, $stemH
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $r = $stemW / 2
    $path.AddArc($stemX, $stemY, $stemW, $stemW, 180, 180)
    $path.AddArc($stemX, $stemY + $stemH - $stemW, $stemW, $stemW, 0, 180)
    $path.CloseFigure()
    $g.FillPath($white, $path)

    # Thermometer bulb (circle at bottom)
    $bulbD = 116 * $scale
    $bulbX = $cx - $bulbD / 2
    $bulbY = $cy + 90 * $scale
    $g.FillEllipse($white, $bulbX, $bulbY, $bulbD, $bulbD)

    # Inner mercury column (accent color) inside stem + bulb
    $innerW = 20 * $scale
    $innerX = $cx - $innerW / 2
    $innerY = $cy - 40 * $scale
    $innerH = ($bulbY + $bulbD - $innerY) - (10 * $scale)
    $innerPath = New-Object System.Drawing.Drawing2D.GraphicsPath
    $ir = $innerW / 2
    $innerPath.AddArc($innerX, $innerY, $innerW, $innerW, 180, 180)
    $innerPath.AddArc($innerX, $innerY + $innerH - $innerW, $innerW, $innerW, 0, 180)
    $innerPath.CloseFigure()
    $g.FillPath($accent, $innerPath)
    $innerBulbD = $bulbD - 28 * $scale
    $g.FillEllipse($accent, $cx - $innerBulbD/2, $bulbY + 14*$scale, $innerBulbD, $innerBulbD)

    # Tick marks on stem
    $pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(255,122,31,43)), (6*$scale)
    for ($i = 0; $i -lt 4; $i++) {
        $ty = $stemY + 30*$scale + $i * 40 * $scale
        $g.DrawLine($pen, $stemX + $stemW, $ty, $stemX + $stemW + 18*$scale, $ty)
    }

    $bmp.Save($OutPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
}

New-AppIcon -Size 192 -OutPath "c:\repos\Mobile apps\Cooking\icons\icon-192.png"
New-AppIcon -Size 512 -OutPath "c:\repos\Mobile apps\Cooking\icons\icon-512.png"
Write-Host "Icons generated."
