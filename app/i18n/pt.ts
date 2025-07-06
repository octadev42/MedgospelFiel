const pt = {
  common: {
    ok: "OK!",
    cancel: "Cancelar",
    back: "Voltar",
  },
  welcomeScreen: {
    postscript:
      "psst  — Isso provavelmente não é como seu app se parece. (A menos que seu designer tenha te entregado essas telas, e nesse caso, envie!)",
    readyForLaunch: "Seu app, quase pronto para o lançamento!",
    exciting: "(ohh, isso é emocionante!)",
    whatsappCall: "Para atendimentos chame:",
  },
  errorScreen: {
    title: "Algo deu errado!",
    friendlySubtitle:
      "Esta é a tela que seus usuários verão em produção quando um erro for lançado. Você vai querer personalizar esta mensagem (localizada em `app/i18n/pt.ts`) e provavelmente o layout também (`app/screens/ErrorScreen`). Se você quiser remover isso completamente, verifique `app/app.tsx` para o componente <ErrorBoundary>.",
    reset: "REINICIAR APP",
  },
  emptyStateComponent: {
    generic: {
      heading: "Tão vazio... tão triste",
      content: "Nenhum dado encontrado ainda. Tente clicar no botão para atualizar ou recarregar o app.",
      button: "Vamos tentar novamente",
    },
  },
}

export default pt 