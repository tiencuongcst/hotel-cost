export function formatNumber(
  value: number | null | undefined,
  maximumFractionDigits = 0
) {
  return Number(value ?? 0).toLocaleString("vi-VN", {
    maximumFractionDigits,
  });
}

export function formatCurrency(value: number | null | undefined) {
  return Number(value ?? 0).toLocaleString("vi-VN", {
    maximumFractionDigits: 0,
  });
}

export function formatPercent(value: number | null | undefined) {
  return `${Number((value ?? 0) * 100).toLocaleString("vi-VN", {
    maximumFractionDigits: 2,
  })}%`;
}
