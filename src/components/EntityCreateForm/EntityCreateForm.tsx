import cc from "classcat";
import styles from "./EntityCreateForm.module.scss";
import {Entity} from "../../types";
import {ChangeEvent, useState} from "react";
import {defaultEntity} from "../../utils/variables";

type Props = {
  onEntityCreate: (entity: Entity) => void;
}

export default function EntityCreateForm({onEntityCreate}: Props) {
  const [tempEntity, setTempEntity] = useState<Partial<Entity>>(defaultEntity)

  const handleTempEntityChange = (e: ChangeEvent<HTMLInputElement>) => {
    const property = e?.currentTarget?.name;
    const value = e?.currentTarget?.value;

    fillTempEntity(property, value)
  }

  const fillTempEntity = (property: string, value: string | number) => {
    setTempEntity({
      ...tempEntity,
      [property]: value
    })
  }

  const handleEntityCreation = () => {
    setTempEntity(defaultEntity)
    onEntityCreate(tempEntity as Entity)
  }

  return (
    <fieldset
      className={cc([styles.entityContainer, styles.entityContainer_empty])}
    >
      <div><input className={styles.entityInput} onChange={handleTempEntityChange} type={"text"} name={'id'} placeholder={'id'}/></div>
      <div><input className={styles.entityInput} onChange={handleTempEntityChange} type={"text"} name={'name'} placeholder={'name'}/></div>
      <div><input className={styles.entityInput} onChange={handleTempEntityChange} type={"number"} name={'health'} max={100} min={0} placeholder={'health'}/></div>
      <div><input className={styles.entityInput} onChange={handleTempEntityChange} type={"number"} name={'attack'} max={50} min={1} placeholder={'attack'}/></div>
      <div><input className={styles.entityInput} onChange={handleTempEntityChange} type={"number"} name={'defense'} max={50} min={1} placeholder={'defense'}/></div>
      <div><input className={styles.entityInput} onChange={handleTempEntityChange} type={"number"} name={'movement'} max={8} min={1} placeholder={'movement'}/></div>
      <div>
        <button onClick={handleEntityCreation}>Add Entity</button>
      </div>
    </fieldset>
  )
}