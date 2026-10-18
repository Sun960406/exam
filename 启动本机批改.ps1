$ErrorActionPreference = 'Stop'
$secureKey = Read-Host '输入更换后的 DeepSeek API Key（输入不显示）' -AsSecureString
$credential = New-Object System.Net.NetworkCredential('', $secureKey)
$env:DEEPSEEK_API_KEY = $credential.Password
$env:GRADER_ACCESS_TOKEN = [Guid]::NewGuid().ToString('N')
$env:DEEPSEEK_MODEL = 'deepseek-flash'
Write-Host '批改服务将在 http://127.0.0.1:8787 启动。'
Write-Host ('本次批改访问口令（填入网页设置）：' + $env:GRADER_ACCESS_TOKEN)
Write-Host '网页设置中的服务地址填写 http://127.0.0.1:8787'
Write-Host '电脑需保持联网；关闭此窗口即停止批改。'
$bundledNode = 'C:\Users\Administrator\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
$nodeCommand = if (Get-Command node -ErrorAction SilentlyContinue) { 'node' } elseif (Test-Path -LiteralPath $bundledNode) { $bundledNode } else { throw '需要安装 Node.js 20 或更高版本。' }
try {
    & $nodeCommand (Join-Path $PSScriptRoot 'server.mjs')
} finally {
    Remove-Item Env:\DEEPSEEK_API_KEY -ErrorAction SilentlyContinue
    Remove-Item Env:\GRADER_ACCESS_TOKEN -ErrorAction SilentlyContinue
    Remove-Item Env:\DEEPSEEK_MODEL -ErrorAction SilentlyContinue
}

