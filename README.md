# Boilerplate SaaS: Checkout de Alta Conversão

Este projeto é um acelerador de vendas focado em conversão, utilizando o fluxo de "validação de lead" via Pix de R$ 0,99 com liberação temporária de voucher.

---

## 📌 Índice

1. Instalação do Boilerplate
2. Dependências e Ferramentas
3. Configuração do Banco de Dados (Supabase)
4. Configuração do Mercado Pago Developers
5. Configuração de E-mail (SMTP)
6. Variáveis de Ambiente (.env.local)
7. Configuração na Vercel (#7-configuração-na-vercel)
8. Dicas Importantes & Segurança (#8-dicas-importantes--segurança)

---

## 1. Instalação do Boilerplate

Clone o repositório e acesse a pasta do projeto:

```bash

# Clone o repositório
git clone [https://github.com/DemetriodosAnjos/boilerplate.git](https://github.com/DemetriodosAnjos/boilerplate.git)

# Acesse a pasta
cd boilerplate
```

---

## 2. Dependências e Ferramentas

Produção (Core)

```bash
npm install next@15.1.6 react@19.2.3 react-dom@19.2.3 mercadopago@2.11.0 @supabase/supabase-js@2.89.0 googleapis@169.0.0 nodemailer@7.0.11 lucide-react

Desenvolvimento (Ferramentas)
npm install -D typescript @types/node @types/react @types/react-dom @types/nodemailer tailwindcss@4.1.18 @tailwindcss/postcss@4.1.18 postcss@8.5.6 autoprefixer@10.4.23 cross-env@10.1.0
```

---

## 3. Configuração do Banco de Dados (Supabase)

Acesse o SQL Editor do seu projeto no Supabase e execute o script abaixo:

```SQL
CREATE TABLE IF NOT EXISTS public.sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  name TEXT,
  external_reference UUID NOT NULL UNIQUE,
  status TEXT DEFAULT 'pending',
  amount DECIMAL(10,2),
  voucher_expires_at TIMESTAMPTZ,
  voucher_used BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Habilitar Realtime para a tabela sales
ALTER PUBLICATION supabase_realtime ADD TABLE public.sales;
```

---

## 4. Configuração do Mercado Pago Developers

1. Acesse o Painel do Desenvolvedor do Mercado Pago. https://www.mercadopago.com.br/developers/pt
2. Obtenha seu Access Token em Credenciais de Produção. (Ver vídeo)
3. Em Webhooks, configure a URL de notificação: https://seu-dominio.com/api/webhooks/mercadopago?secret=SUA_CHAVE_16_DIGITOS (ver vídeo)
4. Selecione o evento: payments.

---

## 5. Configuração de E-mail "SMTP" (Ver vídeo)

Utilize o Gmail ou serviço similar para disparar os vouchers:

- Ative a Verificação em 2 Etapas na sua conta Google.

- Gere uma Senha de App específica para e-mail.

- Use os dados gerados no seu arquivo .env.local.

---

## 6. Variáveis de Ambiente (.env.local)

Crie um arquivo .env.local na raiz do projeto e preencha conforme o modelo:

```bash

# SECURITY
WEBHOOK_SECRET=sua_chave_de_16_numeros

# MERCADO PAGO
MP_ACCESS_TOKEN=APP_USR-xxxxxx
MP_PUBLIC_KEY=APP_USR-xxxxxx

# SUPABASE
NEXT_PUBLIC_SUPABASE_URL=[https://xxxx.supabase.co](https://xxxx.supabase.co)
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxx
SUPABASE_SERVICE_ROLE_KEY=xxxx

# SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=seuemail@gmail.com
SMTP_PASS=sua_senha_de_app
```

---

## 7. Configuração na Vercel (Ver vídeo)

Ao realizar o deploy:

1. Importe o repositório do GitHub.
2. Em Project Settings > Environment Variables, adicione todas as variáveis listadas no item acima.
3. Atenção: A variável WEBHOOK_SECRET deve ser exatamente a mesma utilizada na URL configurada no Mercado Pago.

---

## 8. Dicas Importantes & Segurança

- UUID como Chave: O uso de external_reference como UUID garante que URLs de resgate sejam impossíveis de prever ou sofrer ataques de força bruta.

- Timezone: Utilizamos TIMESTAMPTZ no banco para que o cronômetro de 20 minutos tenha precisão absoluta em qualquer fuso horário.

- Segurança (RLS): O Webhook utiliza a service_role (Admin) para processar os pagamentos, ignorando as travas de RLS por segurança e performance.

- Teste Local: Para testar o recebimento de Webhooks em sua máquina local, utilize o Ngrok: ngrok http 3000.
