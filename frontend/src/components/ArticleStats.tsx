import { useEffect, useState } from "react";
import type { ArticleStats } from "../models";
import { getArticleStats } from "../api/endpoints";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export type ArticleStatsProps = {
    articleId: number;
}


export function ArticleStats({ articleId }: ArticleStatsProps) {
    const [articleStats, setArticleStats] = useState<ArticleStats | null>(null);


    useEffect(() => {
        getArticleStats(articleId)
            .then(setArticleStats)
            .catch((err) => console.error("Error fetching articles:", err));
    }, []);


    return <div>
        <p>Stats:</p>
        {articleStats ? (
            <ul>
                <li>Views: {articleStats.views}</li>
                <li>First Read: {articleStats.first_read ?? "N/A"}</li>
                <li>Last Read: {articleStats.last_read ?? "N/A"}</li>
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={articleStats.all_reads}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="timestamp" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="reads" stroke="#2563eb" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </ul>
        ) : (
            <p>Loading stats...</p>
        )}
    </div>;
}
