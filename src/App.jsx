import Header from './components/Header';
import Footer from './components/Footer';
import BillForm from './components/BillForm';
import { useBillLogic } from './hooks/useBillLogic';

function App() {
  const { state, actions, t, languages } = useBillLogic();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 font-sans pb-40 transition-colors duration-300">
      <Header
        lang={state.lang}
        languages={languages}
        onLangSwitch={actions.handleLangSwitch}
        isMuted={state.isMuted}
        onToggleMute={actions.toggleMute}
        theme={state.theme}
        onToggleTheme={actions.toggleTheme}
      />

      <BillForm
        data={state.data}
        t={t}
        actions={actions}
        activeField={state.activeField}
        errors={state.errors}
      />

      <Footer
        balance={state.balance}
        balanceLabel={t.balance}
        submitLabel={t.submit}
        onSubmit={actions.handleSendWhatsApp}
        isValid={state.isFormValid}
      />
    </div>
  );
}

export default App;
