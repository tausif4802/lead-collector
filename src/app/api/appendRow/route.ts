import { JWT } from 'google-auth-library';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { NextRequest, NextResponse } from 'next/server';

const SCOPES: string[] = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive.file',
];

export async function POST(req: NextRequest, res: NextResponse) {
  const body = await req.json();

  if (!body || !body.handle) {
    return new Response('Please provide a handle.', {
      status: 400,
    });
  }

  const jwt = new JWT({
    email: process.env.CLIENT_EMAIL!,
    key: (process.env.PRIVATE_KEY as string).replace(/\\n/g, '\n'),
    scopes: SCOPES,
  });

  const doc = new GoogleSpreadsheet(
    '19mDA3m_Mqp2XhjiHlM0udCI09XazV-dpEYsmKdsB7Tw',
    jwt
  );

  await doc.loadInfo();

  const sheet = doc.sheetsByIndex[0];

  const handles = await sheet.getCellsInRange('B:B');

  const handleExists = handles.some((row: any) => row[0] === body.handle);

  if (handleExists) {
    return new Response('Lead already in list.', { status: 400 });
  }

  await sheet.addRow({
    Date: new Date().toLocaleDateString(),
    Handle: body.handle,
  });

  return Response.json(
    { message: 'Row appended successfully' },
    { status: 200 }
  );
}
