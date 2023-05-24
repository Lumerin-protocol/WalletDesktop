!macro customUnInstall
  ${ifNot} ${isUpdated}
    ExecWait "TaskKill /IM proxy-router.exe /F"
    ExecWait "sc stop proxySeller"
    ExecWait "sc stop proxyBuyer"
    ExecWait "sc delete proxySeller"
    ExecWait "sc delete proxyBuyer"
  ${endIf}
!macroend