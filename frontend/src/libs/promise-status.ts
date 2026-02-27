"use client";

import { useState } from "react";

export function usePromiseStatus<Fn extends (...args: any[]) => Promise<any>>(
  task: Fn
) {
  type Args = Parameters<Fn>;
  type Result = Awaited<ReturnType<Fn>>;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>();
  const [data, setData] = useState<Result>();

  async function exec(...args: Args): Promise<Result> {
    try {
      setLoading(true);
      const result = await task(...args);
      setData(result);
      setLoading(false);
      return result;
    } catch (err) {
      setLoading(false);
      setError(err as Error);
      throw err;
    }
  }

  return { data, loading, error, exec };
}
