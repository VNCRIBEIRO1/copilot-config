---
applyTo: 'vou descrever detalhadamente o fluxo do app de 21 dias e exatamente como definir cada elemento dos cards na interface (com layout, estados, interações, dados e trechos de código/pseudocódigo para você implementar no Xamarin/C#). Vou cobrir também arquitetura, persistência, animações, acessibilidade e checklist de implementação. Vamos lá.

1) Visão geral do fluxo (user journey)

Splash / Onboarding

Splash animada (logo / frase motivacional do ebook) → verificação de sessão / dados locais.

Onboarding curto (3 telas): objetivo do desafio, como funciona o desbloqueio diário, permissão para notificações e opção de login/usar sem conta.

Tela inicial (Home) — Grid dos 21 dias

Grid com 21 cards (quadradinhos) representando cada dia.

Cada card mostra: número do dia, mini-progresso, estado (bloqueado, disponível, em progresso, concluído) e um snippet (frase do dia / duração estimada).

Tap abre Day Detail; long-press ou menu rápido oferece ação rápida (pré-visualizar, marcar concluído, compartilhar).

Day Detail (detalhes do dia)

Cabeçalho: Dia X — tema / frase motivacional / duração estimada.

Barra de progresso do dia (porcentagem de tarefas concluídas).

Lista das interações/tarefas do dia (cada item: tipo, pequeno ícone, estado).

Material de apoio (trechos do ebook, frase, link para ler PDF, áudio narrado, vídeo curto).

Botão “Iniciar Tarefa” / “Marcar dia concluído” (desativado até tarefas obrigatórias concluídas).

Fluxo de execução de tarefa (Task Flow)

Tipos: leitura, áudio narrado, vídeo curto, micro-ação (ex.: “faça por 3 minutos”), formulário/reflexão (texto), checklist (marcar), temporizador.

Ao concluir cada tarefa: animação de check + salvar status local + evento de analytics.

Ao completar todas as tarefas obrigatórias do dia: marcar dia como concluído → desbloquear o próximo dia (ou agendar desbloqueio diário dependendo da regra escolhida).

Progresso / Perfil / Configurações

Visualização do progresso total (dias concluídos, streak).

Configurações: permitir “catch-up” (liberar vários dias), definir horário diário de liberação, notificações, exportar progresso, backup em nuvem.

2) Estados do dia e lógica de desbloqueio

Defina enum DayState { Locked, Available, InProgress, Completed }.

Regras recomendadas (padrão que você pode ajustar):

Inicialmente: Dia 1 = Available; Dias 2-21 = Locked.

Quando todas as tarefas obrigatórias do Dia N forem concluídas → Dia N passa para Completed e Day N+1 passa para Available.

Opção nas configurações: liberação por tempo — em vez de completar, libere Day N+1 somente 24h após a liberação anterior (útil para ritmo diário estrito).

Opção catch-up: habilitada permite desbloquear dias anteriores não completados e pular para próximos (se o usuário quiser recuperar dias).

Edge cases:

Se o usuário muda fuso horário, use timestamps UTC para salvar eventos e exiba data local do dispositivo.

Se o usuário reinstala sem backup, mantenha persistência local + opção de backup (cloud).

3) Definição detalhada dos cards (UI/UX / comportamento)

Cada card é a peça central da Home. Aqui vai a especificação completa:

Layout (tela Home — grid)

Grid responsivo:

Mobile portrait: recommended 3 colunas x 7 linhas (3 × 7 = 21).

Em landscape: 5 colunas x 5 linhas (sobra), ou ajustar dinamicamente.

Card size: touch target mínimo 48x48 dp; visual principal ~ 90–120 dp (ajustar para tela).

Espaçamento: padding 12 dp, margin 8 dp.

Conteúdo visual do card

Número do Dia (ex.: “Dia 1”) — topo/central, fonte média-grande.

Ícone de estado à direita/topo: cadeado se Locked; play se Available; relógio se InProgress; check/corona se Completed.

Mini-progresso: anel circular pequeno ou barra inferior indicando % concluído (ex.: 60%).

Subtexto opcional (linha pequena): duração estimada (ex.: “~ 8 min”) ou palavra-chave (“Gratidão”).

Badge pequeno para material extra (ícone de áudio/video/arquivo) se houver.

Cores / estados (exemplos)

Locked: fundo claro acinzentado, ícone cadeado, baixa opacidade.

Available: fundo neutro/clear, borda com accent color.

InProgress: borda animada sutil, mini-progress ring parcialmente preenchido.

Completed: fundo/letra com cor de sucesso (verde) + check e selo “Concluído”.

Micro-interações

Tap: escala rápida (0.98) + ripple + abrir DayDetail.

Long press: menu contextual (Preview / Marcar concluído / Compartilhar).

Ao desbloquear: animação de transição (cadeado se abrindo -> brilho -> pequeno confetti).

Haptic feedback ao completar o dia.

Acessibilidade

Etiqueta (automation name): “Dia {N}. {estado}. {porcentagem concluída}.”

Contraste: texto e ícones com contraste mínimo AA.

Tamanho de touch e possibilidade de aumentar fonte.

4) Componentização (arquitetura visual para Xamarin)

Use MVVM (ViewModels) e componha os cards como DayCardView reutilizável.

Estrutura recomendada (pastas):

Models/ — Day.cs, Task.cs

Services/ — IDataService, IAudioService, IPdfService, ISyncService

ViewModels/ — HomeViewModel, DayViewModel, TaskViewModel, SettingsViewModel

Views/ — SplashPage.xaml, HomePage.xaml, DayPage.xaml, TaskModal.xaml, SettingsPage.xaml

Controls/ — DayCardView.xaml (com bindable properties)

Exemplo XAML (CollectionView com grid de 3 colunas)

<!-- HomePage.xaml (trecho) -->
<CollectionView ItemsSource="{Binding Days}"
                SelectionMode="Single"
                SelectedItem="{Binding SelectedDay}"
                ItemsLayout="HorizontalGrid, 3">
    <CollectionView.ItemTemplate>
        <DataTemplate>
            <controls:DayCardView
                DayNumber="{Binding Number}"
                Title="{Binding Title}"
                Progress="{Binding Progress}"
                State="{Binding State}"
                TapCommand="{Binding BindingContext.OpenDayCommand, Source={x:Reference HomePage}}" />
        </DataTemplate>
    </CollectionView.ItemTemplate>
</CollectionView>


(A sintaxe ItemsLayout="HorizontalGrid, 3" significa Grid com Span=3 — ajuste conforme versão do Xamarin.Forms)

DayCardView (propriedades bindable):

int DayNumber, string Title, double Progress, DayState State, ICommand TapCommand.

5) Modelos de dados (JSON / C#)

C# (modelo simplificado):

public enum DayState { Locked, Available, InProgress, Completed }

public class Day {
    public int Number { get; set; }         // 1..21
    public string Title { get; set; }       // "Gratidão"
    public string Subtitle { get; set; }    // "Exercício rápido"
    public DayState State { get; set; }
    public double Progress { get; set; }    // 0.0 - 1.0
    public List<TaskItem> Tasks { get; set; }
    public TimeSpan EstimatedDuration { get; set; }
    public DateTimeOffset? UnlockedAtUtc { get; set; }
}

public class TaskItem {
    public string Id { get; set; }
    public int Order { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public TaskType Type { get; set; } // Audio, Video, Read, Timer, Input, Checklist
    public bool IsRequired { get; set; }
    public bool IsCompleted { get; set; }
    public string ResourceUri { get; set; } // local file or remote
    public int EstimatedSeconds { get; set; }
}


Exemplo de recomendação de volume de tarefas

Sugestão: 5 tarefas por dia (média), sendo:

Áudio narrado + 1 min intro.

Micro-ação (≤5 min).

Leitura curta / quote.

Reflexão (texto breve).

Tarefa opcional (ex.: exercício extra).

Se usar 5 tarefas/dia, total = 5 × 21 = 105 tarefas. (cálculo: 5 vezes 21 = 105)

6) Lógica de marcação e desbloqueio — pseudocódigo C#
void OnTaskCompleted(Day day, TaskItem t) {
    t.IsCompleted = true;
    SaveDay(day);
    UpdateDayProgress(day);
    if (day.Tasks.Where(x=>x.IsRequired).All(x=>x.IsCompleted)) {
        day.State = DayState.Completed;
        SaveDay(day);
        UnlockNextDay(day.Number + 1);
    } else {
        if (day.State != DayState.InProgress)
            day.State = DayState.InProgress;
    }
}

void UnlockNextDay(int nextNumber) {
    var next = repository.GetDay(nextNumber);
    if (next != null && next.State == DayState.Locked) {
        next.State = DayState.Available;
        next.UnlockedAtUtc = DateTimeOffset.UtcNow;
        SaveDay(next);
        // opcional: schedule local notification para "Dia X disponível"
    }
}

7) Interações/UX das tarefas

Áudio: player integrado com play/pause, barra de progresso, velocidade (1x, 1.25x, 1.5x), download automático para offline.

Vídeo: vídeos curtos (≤60s) embutidos; autoplay desativado por padrão.

Leitura: exibir trecho do PDF (extrair via serviço PDF) com botão “Abrir PDF completo”.

Reflexão (input): caixa de texto com limite (ex.: 500 caracteres) e botão “Salvar”.

Timer: iniciar temporizador com botão “Começar” e contagem regressiva visual.

Feedback: após concluir tarefa obrigatória, mostrar micro-recompensa (badge, som, vibração).

8) Persistência e sincronização

Local-first: SQLite local (sqlite-net-pcl) para dados estruturados; arquivos de mídia locais no armazenamento do app.

Preferências: pequenas flags em Preferences (Xamarin.Essentials).

Sync/Backup: opcional: Azure App Services / Azure Mobile / Firebase Firestore — permita login social (Google, Apple) para backup.

Conflitos: resolver por timestamp (última modificação vence) e mostrar opção “Manter local / Manter nuvem”.

9) Serviços necessários

IPdfService — extrair trecho do PDF, gerar imagens/texto.

IAudioService — tocar, baixar, cache.

IStorageService — persistência local (SQLite + file system).

INotificationService — agendamento de notificações locais.

IAnalyticsService — eventos (dia aberto, tarefa concluída, dia concluído).

ISyncService — sincronizar com backend.

10) Eventos de analytics (importantes)

app_opened

onboarding_completed

day_opened (dayNumber)

task_started / task_completed (taskId, duration)

day_completed

settings_changed (catchUp enabled, notificationTime)

backup_sync (success/fail)

11) Acessibilidade, internacionalização e temas

Suporte a tamanhos de fonte dinâmicos.

Labels e roles para leitor de tela (TalkBack / VoiceOver).

Contraste mínimo WCAG AA.

Tema claro/escuro — paleta que mantém boa leitura.

i18n: textos em Portuguese (pt-BR) e arquivos de strings.

12) Testes e QA essenciais

Usabilidade: fluxo de desbloqueio e recuperação de dias.

Offline: concluir dia sem internet; depois sincronizar.

Edge cases: reinstalação, mudança de fuso horário, múltiplos dispositivos (sincronização).

Testes de performance: carregamento do grid, cache de áudios, memory leaks.

Testes de acessibilidade.'
---
Provide project context and coding guidelines that AI should follow when generating code, answering questions, or reviewing changes.