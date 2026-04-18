---
applyTo: ' Guia Completo de Setup - WhatsApp UI Manager com WPPConnect
📁 Estrutura de Diretórios Principal
wpp_manager_project/
├── wppconnect-server/          # Backend API
├── wpp_ui_flutter_desktop/     # Frontend Flutter Desktop
├── docs/                       # Documentação do projeto
├── scripts/                    # Scripts de automação
└── README.md                   # Documentação principal

🛠️ ETAPA 1: Configuração do Ambiente
Pré-requisitos

 Node.js (v16 ou superior) - para WPPConnect
 Flutter SDK (v3.0 ou superior) - para interface desktop
 Git - para clonagem dos repositórios
 VS Code com extensões Flutter e Copilot
 Google Chrome - para WhatsApp Web

Verificação do Ambiente
bash# Verificar instalações
node --version
npm --version
flutter --version
git --version

🔧 ETAPA 2: Setup do Backend (WPPConnect)
2.1. Criação da Pasta Principal
bash# Criar diretório raiz do projeto
mkdir wpp_manager_project
cd wpp_manager_project
2.2. Clonagem do WPPConnect Server
bash# Clonar o repositório oficial do WPPConnect
git clone https://github.com/wppconnect-team/wppconnect-server.git
cd wppconnect-server
2.3. Instalação e Configuração
bash# Instalar dependências
npm install

# Copiar arquivo de configuração
cp src/config/session.default.js src/config/session.js
cp src/config/globalApiConfig.default.js src/config/globalApiConfig.js
2.4. Configuração dos Endpoints
Arquivo: src/config/globalApiConfig.js
javascriptmodule.exports = {
  // Configurações principais
  host: 'localhost',
  port: '21465',
  deviceName: 'WPP-FLUTTER-DESKTOP',
  poweredBy: 'WPP-FLUTTER-DESKTOP',
  startAllSession: true,
  tokenStoreType: 'file',
  maxListeners: 15,
  
  // CORS para Flutter Desktop
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  },

  // Webhook para receber eventos (opcional)
  webhook: {
    url: null,
    autoDownload: true,
    uploadS3: false,
    readMessage: true,
    allUnreadOnStart: false,
    listenAcks: true,
    onPresenceChanged: true,
    onParticipantsChanged: true,
    onReactionMessage: true,
    onPollResponse: true,
    onRevokedMessage: true,
    onLabelUpdated: true,
    onSelfMessage: false,
    ignore: ['status@broadcast']
  }
};
2.5. Inicialização do Servidor
bash# Iniciar servidor WPPConnect
npm start

# O servidor estará disponível em:
# http://localhost:21465
# Swagger UI: http://localhost:21465/api-docs
2.6. Teste da API
bash# Testar se a API está funcionando
curl http://localhost:21465/api/flutter-session/status

# Resposta esperada:
# {"status": "CLOSED", "session": "flutter-session"}

📱 ETAPA 3: Setup do Frontend Flutter
3.1. Criação do Projeto Flutter
bash# Voltar para diretório raiz
cd ../

# Criar projeto Flutter Desktop
flutter create wpp_ui_flutter_desktop --platforms=windows,macos,linux
cd wpp_ui_flutter_desktop
3.2. Configuração do pubspec.yaml
Arquivo: pubspec.yaml
yamlname: wpp_ui_flutter_desktop
description: WhatsApp UI Manager with WPPConnect Integration

version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  
  # UI e Navegação
  cupertino_icons: ^1.0.2
  
  # HTTP e API
  http: ^1.1.0
  dio: ^5.3.2
  
  # Estado e Dados
  provider: ^6.0.5
  
  # Banco de Dados
  sqflite: ^2.3.0
  sqflite_common_ffi: ^2.3.0
  
  # Arquivos e I/O
  file_picker: ^6.1.1
  path_provider: ^2.1.1
  csv: ^5.0.2
  
  # QR Code
  qr_flutter: ^4.1.0
  
  # UI Adicional
  flutter_launcher_icons: ^0.13.1

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true
  
  assets:
    - assets/images/

flutter_launcher_icons:
  android: false
  ios: false
  web: false
  windows:
    generate: true
    image_path: "assets/images/whatsapp_icon.png"
  macos:
    generate: true
    image_path: "assets/images/whatsapp_icon.png"
  linux:
    generate: true
    image_path: "assets/images/whatsapp_icon.png"
3.3. Instalação das Dependências
bash# Instalar packages
flutter pub get

# Gerar ícones (opcional)
flutter pub run flutter_launcher_icons

🏗️ ETAPA 4: Estrutura da Aplicação Flutter
4.1. Estrutura de Diretórios
lib/
├── main.dart
├── models/
│   ├── contact.dart
│   ├── session.dart
│   ├── message.dart
│   └── api_response.dart
├── services/
│   ├── wpp_api_service.dart
│   ├── database_service.dart
│   └── file_service.dart
├── screens/
│   ├── home_screen.dart
│   └── tabs/
│       ├── session_tab.dart
│       ├── contacts_tab.dart
│       └── messages_tab.dart
├── widgets/
│   ├── custom_card.dart
│   ├── contact_tile.dart
│   ├── message_preview.dart
│   └── loading_overlay.dart
├── utils/
│   ├── constants.dart
│   ├── validators.dart
│   └── formatters.dart
└── theme/
    └── app_theme.dart
4.2. Configuração Principal (main.dart)
dartimport 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:sqflite_common_ffi/sqflite_ffi.dart';
import 'services/database_service.dart';
import 'screens/home_screen.dart';
import 'theme/app_theme.dart';

void main() {
  // Inicializar SQLite para desktop
  sqfliteFfiInit();
  databaseFactory = databaseFactoryFfi;
  
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => DatabaseService(),
      child: MaterialApp(
        title: 'WhatsApp UI Manager',
        theme: AppTheme.lightTheme,
        home: HomeScreen(),
        debugShowCheckedModeBanner: false,
      ),
    );
  }
}

🔗 ETAPA 5: Integração com WPPConnect API
5.1. Service de Integração com API
Arquivo: lib/services/wpp_api_service.dart
dartimport 'dart:convert';
import 'package:http/http.dart' as http;

class WppApiService {
  static const String baseUrl = 'http://localhost:21465/api';
  static const String sessionName = 'flutter-session';
  
  // Endpoints principais baseados no Swagger
  static const String _statusEndpoint = '/flutter-session/status';
  static const String _startEndpoint = '/flutter-session/start-session';
  static const String _qrcodeEndpoint = '/flutter-session/start-session';
  static const String _sendMessageEndpoint = '/flutter-session/send-message';
  static const String _contactsEndpoint = '/flutter-session/all-contacts';
  static const String _closeEndpoint = '/flutter-session/close-session';

  // Métodos de sessão
  Future<Map<String, dynamic>> getSessionStatus() async {
    // Implementar chamada para verificar status da sessão
  }

  Future<Map<String, dynamic>> startSession() async {
    // Implementar inicialização da sessão
  }

  Future<String> getQRCode() async {
    // Implementar obtenção do QR code
  }

  Future<bool> closeSession() async {
    // Implementar fechamento da sessão
  }

  // Métodos de contatos
  Future<List<Map<String, dynamic>>> getAllContacts() async {
    // Implementar obtenção de todos os contatos
  }

  // Métodos de mensagens
  Future<bool> sendMessage(String phone, String message) async {
    // Implementar envio de mensagem
  }
}
5.2. Mapeamento dos Endpoints do Swagger
Principais endpoints a serem integrados:
GET    /api/{session}/status                 # Status da sessão
POST   /api/{session}/start-session          # Iniciar sessão
GET    /api/{session}/qrcode                 # Obter QR code
POST   /api/{session}/send-message           # Enviar mensagem
GET    /api/{session}/all-contacts           # Listar contatos
POST   /api/{session}/close-session          # Fechar sessão

📋 ETAPA 6: Implementação das Abas
6.1. ABA HOME - Gestão da Sessão
Funcionalidades:

 Mostrar status da sessão (Conectado/Desconectado/Conectando)
 Botão "Iniciar Sessão" → chama API /start-session
 Mostrar QR Code → obtém de /qrcode e exibe
 Botão "Encerrar Sessão" → chama API /close-session
 Indicadores visuais de status com cores

Fluxo Esperado:

App abre mostrando "Desconectado"
Usuário clica "Iniciar Sessão"
Status muda para "Conectando..."
QR Code aparece automaticamente
Usuário escaneia QR no WhatsApp
Status muda para "Conectado"
QR Code desaparece

6.2. ABA CONTATOS - Gestão de Contatos
Funcionalidades:

 Importação de arquivos:

Botão "Importar TXT" → selecionar arquivo .txt
Botão "Importar CSV" → selecionar arquivo .csv
Preview dos dados antes de confirmar importação


 Importação via API:

Botão "Importar do WhatsApp" → chama /all-contacts
Sincronizar com contatos do WhatsApp Web


 Lista de contatos:

DataTable com colunas: [Checkbox] | Nome | Telefone | Ações
Checkbox "Selecionar Todos" no header
Botões: Editar, Excluir por linha
Counter: "X de Y contatos selecionados"


 Exportação:

Botão "Exportar TXT" → salvar contatos selecionados
Botão "Exportar CSV" → salvar contatos selecionados



Formatos de arquivo:

TXT: Um contato por linha (nome;telefone)
CSV: Colunas nome,telefone,email

6.3. ABA MENSAGENS - Envio de Mensagens
Layout esperado:
┌─────────────────────────────────────────────────────┐
│  Selecionar Destinatários  │  Compor Mensagem       │
│                            │                        │
│  □ Selecionar Todos        │  ┌──────────────────┐   │
│  □ João (11999999999)      │  │ Digite sua       │   │
│  ☑ Maria (11888888888)     │  │ mensagem...      │   │
│  □ Pedro (11777777777)     │  │                  │   │
│                            │  └──────────────────┘   │
│  2 de 3 selecionados       │  150 caracteres         │
│                            │                        │
│                            │  Preview da Mensagem:   │
│                            │  ┌──────────────────┐   │
│                            │  │ 📱 Olá Maria!    │   │
│                            │  │    Como vai?     │   │
│                            │  └──────────────────┘   │
│                            │                        │
│                            │  Configurações:         │
│                            │  Delay min: [5] seg     │
│                            │  Delay max: [15] seg    │
│                            │  ☑ Delay aleatório      │
│                            │                        │
│                            │  [▶ Enviar Mensagens]  │
└─────────────────────────────────────────────────────┘
Funcionalidades:

 Seleção de destinatários:

Lista sincronizada com aba "Contatos"
Checkbox individual e "Selecionar Todos"
Counter dinâmico de selecionados


 Composição de mensagem:

TextField multiline para digitar mensagem
Contador de caracteres em tempo real
Preview formatado simulando WhatsApp


 Configurações de envio:

Slider para delay mínimo (1-60s)
Slider para delay máximo (5-300s)
Toggle para ativar delay aleatório
Preview do tempo total estimado


 Processo de envio:

Botão "Enviar Mensagens"
Dialog de confirmação com resumo
Progress bar durante envio
Log em tempo real: "Enviando para João... ✅"
Relatório final com sucessos/falhas'
---
Provide project context and coding guidelines that AI should follow when generating code, answering questions, or reviewing changes.