!macro customInstallMode
  StrCpy $isForceCurrentInstall "1"
!macroend

!macro customInstall
  StrCpy $0 "$APPDATA\Alpha"
  CreateDirectory $0
  FileOpen $1 "$0\first-run.flag" w
  FileWrite $1 "true"
  FileClose $1
!macroend

!macro customInit
  nsExec::Exec '"$LOCALAPPDATA\Alpha\Update.exe" --uninstall -s'
!macroend

!macro customUnInstall
  DeleteRegKey HKCU "Software\Classes\Drive\shell\Alpha"
  DeleteRegKey HKCU "Software\Classes\Directory\shell\Alpha"
  DeleteRegKey HKCU "Software\Classes\Directory\Background\shell\Alpha"
!macroend