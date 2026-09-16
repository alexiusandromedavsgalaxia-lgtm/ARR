import type * as A from './ast.js';

/** First real freestanding target: a 512-byte x86 BIOS boot sector. */
export function compileX86Bios(program: A.Program): string {
  const boot = program.body.filter((s): s is A.BootStmt => s.kind === 'Boot');
  if (boot.length === 0) throw new Error('ARR native: x86-bios target requires a boot block');
  if (boot.length > 1) throw new Error('ARR native: only one boot block is supported');

  const strings: string[] = [];
  for (const stmt of boot[0].body.body) {
    if (stmt.kind !== 'ExprStmt' || stmt.expr.kind !== 'Call') {
      throw new Error('ARR native: x86-bios boot currently supports only print("...") statements');
    }
    const call = stmt.expr;
    if (call.callee.kind !== 'Identifier' || call.callee.name !== 'print' || call.args.length !== 1 || call.args[0].kind !== 'Literal' || typeof call.args[0].value !== 'string') {
      throw new Error('ARR native: x86-bios boot currently supports only print("...") statements');
    }
    strings.push(call.args[0].value);
  }

  const db = strings.map((s, i) => `msg${i}: db ${asmString(s)}, 0`).join('\n');
  const calls = strings.map((_, i) => `    mov si, msg${i}\n    call print_string`).join('\n');
  return `bits 16\norg 0x7c00\n\nstart:\n    cli\n    xor ax, ax\n    mov ds, ax\n    mov es, ax\n    mov ss, ax\n    mov sp, 0x7c00\n    sti\n${calls || '    nop'}\n.halt:\n    hlt\n    jmp .halt\n\nprint_string:\n.next:\n    lodsb\n    test al, al\n    jz .done\n    mov ah, 0x0e\n    mov bh, 0\n    mov bl, 0x07\n    int 0x10\n    jmp .next\n.done:\n    ret\n\n${db}\n\ntimes 510-($-$$) db 0\ndw 0xaa55\n`;
}

function asmString(value: string): string {
  const bytes = [...Buffer.from(value, 'utf8')];
  if (bytes.length === 0) return '0';
  return bytes.map(b => `0x${b.toString(16).padStart(2, '0')}`).join(', ');
}
