import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { subject, content, recipients } = await req.json();

    if (!subject || !content || !recipients || !Array.isArray(recipients)) {
      throw new Error('Invalid request body');
    }

    console.log('SMTP Configuration:', {
      hostname: Deno.env.get('SMTP_HOSTNAME'),
      port: Deno.env.get('SMTP_PORT'),
      username: Deno.env.get('SMTP_USERNAME'),
      from: Deno.env.get('SMTP_FROM')
    });

    const client = new SMTPClient({
      connection: {
        hostname: Deno.env.get('SMTP_HOSTNAME')!,
        port: Number(Deno.env.get('SMTP_PORT')),
        tls: true,
        auth: {
          username: Deno.env.get('SMTP_USERNAME')!,
          password: Deno.env.get('SMTP_PASSWORD')!,
        },
      },
    });

    for (const recipient of recipients) {
      await client.send({
        from: Deno.env.get('SMTP_FROM')!,
        to: recipient,
        subject: subject,
        content: content,
        html: content,
      });
    }

    await client.close();

    return new Response(
      JSON.stringify({ message: 'Newsletter sent successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
}); 