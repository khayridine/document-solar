// components/PvCapacityCalculator.tsx
import { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import styles from './PvCapacityCalculator.module.css'

const months = [
  'Décembre',
  'Janvier',
  'Novembre',
  'Février',
  'Octobre',
  'Mars',
  'Septembre',
  'Avril',
  'Août',
  'Mai',
  'Juin',
  'Juillet',
]
const cities = ['Jendouba', 'Tunis', 'Gabes', 'Kairouan', 'Tozeur', 'Sfax']

const solarData: { [key: string]: { [key: string]: number } } = {
  Décembre: { Jendouba: 2030, Tunis: 2400, Gabes: 2730, Kairouan: 2810, Tozeur: 2640, Sfax: 2950 },
  Janvier: { Jendouba: 2140, Tunis: 2280, Gabes: 2920, Kairouan: 2910, Tozeur: 2770, Sfax: 2950 },
  Novembre: { Jendouba: 2560, Tunis: 2620, Gabes: 3200, Kairouan: 3340, Tozeur: 3120, Sfax: 3260 },
  Février: { Jendouba: 2820, Tunis: 2900, Gabes: 3700, Kairouan: 3610, Tozeur: 3610, Sfax: 3730 },
  Octobre: { Jendouba: 3460, Tunis: 3670, Gabes: 4210, Kairouan: 4230, Tozeur: 4360, Sfax: 4270 },
  Mars: { Jendouba: 3990, Tunis: 4450, Gabes: 4870, Kairouan: 4950, Tozeur: 4030, Sfax: 4990 },
  Septembre: { Jendouba: 4850, Tunis: 5390, Gabes: 5420, Kairouan: 5420, Tozeur: 5600, Sfax: 5340 },
  Avril: { Jendouba: 4960, Tunis: 4970, Gabes: 5890, Kairouan: 5780, Tozeur: 6400, Sfax: 5790 },
  Août: { Jendouba: 5850, Tunis: 6440, Gabes: 6540, Kairouan: 6490, Tozeur: 7170, Sfax: 6860 },
  Mai: { Jendouba: 5970, Tunis: 6100, Gabes: 6790, Kairouan: 6910, Tozeur: 6760, Sfax: 6830 },
  Juin: { Jendouba: 6690, Tunis: 7550, Gabes: 7160, Kairouan: 7360, Tozeur: 7460, Sfax: 7380 },
  Juillet: { Jendouba: 6750, Tunis: 7560, Gabes: 7310, Kairouan: 7290, Tozeur: 7760, Sfax: 7580 },
}

function calculatePvCapacity(
  pumpPowerCV: number,
  operationHours: number,
  solarIrradiance: number,
  acLoss = 0.03,
  dcLoss = 0.01,
  inverterEfficiency = 0.93
): number {
  const pumpPowerKW = pumpPowerCV / 1.36
  const dailyEnergyRequirement = pumpPowerKW * operationHours
  const ipvEfficiency = inverterEfficiency * (1 - (acLoss + dcLoss))
  const globalEfficiency = ipvEfficiency * 0.9
  const pvCapacity = dailyEnergyRequirement / (globalEfficiency * solarIrradiance)
  return pvCapacity
}

const PvCapacityCalculator = () => {
  const [pumpPowerCV, setPumpPowerCV] = useState<number>(75)
  const [operationHours, setOperationHours] = useState<number>(10)
  const [solarIrradiance, setSolarIrradiance] = useState<number>(0)
  const [city, setCity] = useState<string>('')
  const [month, setMonth] = useState<string>('')
  const [pvCapacity, setPvCapacity] = useState<number | null>(null)

  useEffect(() => {
    if (city && month) {
      setSolarIrradiance(solarData[month][city])
    }
  }, [city, month])

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    setter: React.Dispatch<React.SetStateAction<any>>
  ) => {
    setter(e.target.value)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const capacity = calculatePvCapacity(pumpPowerCV, operationHours, solarIrradiance)
    setPvCapacity(capacity)
  }

  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <h1 className={styles.heading}>PV Capacity Calculator</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div>
            <label className={styles.label}>
              City:
              <select
                value={city}
                onChange={(e) => handleInputChange(e, setCity)}
                className={styles.input}
              >
                <option value="">Select City</option>
                {cities.map((city, index) => (
                  <option key={index} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div>
            <label className={styles.label}>
              Month:
              <select
                value={month}
                onChange={(e) => handleInputChange(e, setMonth)}
                className={styles.input}
              >
                <option value="">Select Month</option>
                {months.map((month, index) => (
                  <option key={index} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div>
            <label className={styles.label}>
              Pump Power (CV):
              <input
                type="number"
                value={pumpPowerCV}
                onChange={(e) => handleInputChange(e, setPumpPowerCV)}
                className={styles.input}
              />
            </label>
          </div>
          <div>
            <label className={styles.label}>
              Operation Hours:
              <input
                type="number"
                value={operationHours}
                onChange={(e) => handleInputChange(e, setOperationHours)}
                className={styles.input}
              />
            </label>
          </div>
          <div>
            <label className={styles.label}>
              Solar Irradiance (Wh/m²/day):
              <input type="number" value={solarIrradiance} readOnly className={styles.input} />
            </label>
          </div>
          <button type="submit" className={styles.button}>
            Calculate
          </button>
        </form>
        {pvCapacity !== null && (
          <div className={styles.result}>
            <h2>Required Photovoltaic Capacity: {pvCapacity.toFixed(2)} kWc</h2>
          </div>
        )}
      </div>
    </div>
  )
}

export default PvCapacityCalculator
