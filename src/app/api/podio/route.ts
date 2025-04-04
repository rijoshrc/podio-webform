import Podio from "@phasesdk/api-client-for-podio";

export async function POST(request: Request) {
  const { appId, appToken } = await request.json();

  const clientId = process.env.PODIO_CLIENT_ID as string;
  const clientSecret = process.env.PODIO_CLIENT_SECRET as string;

  const auth = await Podio.auth({
    client_id: clientId,
    client_secret: clientSecret,
  }).appAuth(appId, appToken);

  console.log(auth);

  const app = await Podio.api.app(auth).get(appId);

  console.log(app.data);

  return Response.json({ status: true, data: app.data });
}
