import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, password, deviceId }: { email: string; password: string; deviceId?: string } = await req.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ success: false, message: 'Email y contraseña son requeridos' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Mock registration response
    const mockUser = {
      id: crypto.randomUUID(),
      email,
      device_id: deviceId || crypto.randomUUID(),
      access_token: crypto.randomUUID()
    };

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: mockUser.id,
          email: mockUser.email
        },
        access_token: mockUser.access_token,
        device_id: mockUser.device_id
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});