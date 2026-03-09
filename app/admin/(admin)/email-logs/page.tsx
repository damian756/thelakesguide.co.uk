import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Email Logs | Admin",
  description: "Weekly email logs.",
  robots: { index: false, follow: false },
};

export default async function AdminEmailLogsPage() {
  const logs = await prisma.weeklyEmailLog.findMany({
    take: 50,
    orderBy: { sentAt: "desc" },
    include: {
      business: { select: { name: true } },
    },
  });

  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-2xl font-bold text-[#1B2E4B] mb-6">
        Email logs
      </h1>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="text-left py-3 px-6 font-semibold text-gray-600">
                Business
              </th>
              <th className="text-left py-3 px-6 font-semibold text-gray-600">
                Sent at
              </th>
              <th className="text-left py-3 px-6 font-semibold text-gray-600">
                Week start
              </th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr
                key={log.id}
                className="border-b border-gray-50 last:border-0"
              >
                <td className="py-4 px-6 font-medium text-[#1B2E4B]">
                  {log.business.name}
                </td>
                <td className="py-4 px-6 text-gray-600">
                  {new Date(log.sentAt).toLocaleString("en-GB")}
                </td>
                <td className="py-4 px-6 text-gray-600">
                  {new Date(log.weekStart).toLocaleDateString("en-GB")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {logs.length === 0 && (
          <p className="px-6 py-8 text-gray-500 text-sm">No logs yet.</p>
        )}
      </div>
    </div>
  );
}
