export function paginateUtils(totalPages: number, currentPage: number, siblingCount = 1, boundaryCount = 1): Array<number | '…'> {
  const totalNumbers = siblingCount * 2 + boundaryCount * 2 + 3;
  if (totalPages <= totalNumbers) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  // left boundary pages
  const pages: Array<number | '…'> = []
  for (let i = 1; i <= boundaryCount; i++) {
    pages.push(i);
  }

  const leftSibling = Math.max(currentPage - siblingCount, boundaryCount + 2);
  const rightSibling = Math.min(currentPage + siblingCount, totalPages - boundaryCount - 1);

  if (leftSibling > boundaryCount + 2) {
    pages.push('…');
  }
  else {
    for (let i = boundaryCount + 1; i < leftSibling; i++) {
      pages.push(i);
    }
  }

  // middle window
  for (let i = leftSibling; i <= rightSibling; i++) {
    pages.push(i);
  }

  if (rightSibling < totalPages - boundaryCount - 1) {
    pages.push('…');
  }
  else {
    for (let i = rightSibling + 1; i <= totalPages - boundaryCount; i++) {
      pages.push(i);
    }
  }

  // right boundary pages
  for (let i = totalPages - boundaryCount + 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return pages;
}

export function formatRupiah(value: number | string | undefined): string {
  const numberValue = Number(value);
  if (isNaN(numberValue)) {
    return "-";
  }
  
  return numberValue.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatStock(stock: number | string | undefined): string {
  const numberStock = Number(stock);
  if (isNaN(numberStock)) {
    return "-";
  }

  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: numberStock % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });

  return formatter.format(numberStock);
}