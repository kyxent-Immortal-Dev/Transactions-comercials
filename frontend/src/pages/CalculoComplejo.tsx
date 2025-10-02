import { useMemo, useState } from "react";

export const CalculoComplejo = () => {
  const [salario, setSalario] = useState<number>(0);

  // Porcentajes reales
  const AFP = 0.0725;    // 7.25%
  const AFP_P = 0.0875;  // 8.75%
  const ISSS = 0.03;     // 3%
  const ISR = 0.06;      // 6% simplificado

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSalario(Number(e.target.value));
  };

  const totalDeducciones = useMemo(() => {
    const afp = salario * AFP;
    const afpP = salario * AFP_P;
    const isss = salario * ISSS;
    const renta = salario * ISR;

    return afp + afpP + isss + renta;
  }, [salario]);

  const salarioNeto = useMemo(() => salario - totalDeducciones, [salario, totalDeducciones]);

  return (
    <div className="p-4 bg-white rounded-lg">
      <h1 className="text-xl text-black font-bold mb-4">Cálculo de Salario 2025 - El Salvador</h1>

      <div className="mb-4">
        <label htmlFor="salario" className="block text-black mb-2">Ingresa tu salario:</label>
        <input
          id="salario"
          type="number"
          value={salario}
          onChange={handleChange}
          className="border p-2 text-black rounded w-full"
        />
      </div>

      <div className="mt-4 text-black">
        <p>Deducciones totales: $ {totalDeducciones.toFixed(2)}</p>
        <p>Salario neto: $ {salarioNeto.toFixed(2)}</p>
      </div>
    </div>
  );
};
