import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.scss'
import cc from 'classcat'
import {useState} from "react";

const Home: NextPage = () => {
  const [selectedPos, setSelectedPos] = useState<Array<number> | null>(null)

  const handleGridClick = (yPos: number, xPos: number) => {
    setSelectedPos([yPos, xPos])
  }

  const isSelectedPos = (yPos: number, xPos: number) => {
    if(selectedPos === null) return false
    if(yPos !== selectedPos[0]) return false;

    return xPos === selectedPos[1];
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Clone Emblem</title>
        <meta name="description" content="Fire Emblem Clone" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {
          selectedPos !== null &&
            <div>
              Selected Position: X:{selectedPos[0]}, Y:{selectedPos[1]}
            </div>
        }
        {[...Array(8)].map((_, rowIndex) => (
          <div key={`grid_${rowIndex}_0`} className={cc([styles.tile, styles.tile_container])}>
            {[...Array(8)].map((_, colIndex) => (
              <div
                key={`grid_${rowIndex}_${colIndex}`}
                className={cc([styles.tile, styles.tile_grass, isSelectedPos(rowIndex, colIndex) && styles.tile_selected])}
                onClick={() => handleGridClick(rowIndex, colIndex)}
              />
            ))}
          </div>
        ))}
      </main>
    </div>
  )
}

export default Home
