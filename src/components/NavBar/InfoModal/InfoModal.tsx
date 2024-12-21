import React, { useState } from 'react';
import Modal from 'react-modal';
import styles from './InfoModal.module.less'

interface InfoModalProps{
    isInfoModalOpen:boolean;
    setInfoModalIsOpen:React.Dispatch<React.SetStateAction<boolean>>;
}

const InfoModal:React.FC<InfoModalProps> = ({isInfoModalOpen,setInfoModalIsOpen}) => {
  return (
    <Modal className={styles.info_modal}
    isOpen = {isInfoModalOpen}
    onRequestClose={()=>setInfoModalIsOpen(false)}
    >
      <div className={styles.info_modal_title}>
        <h1>About me section</h1>
      </div>
      <div className={styles.info_modal_content}>
        <p>what should I write here?</p>
      </div>
    </Modal>
  )
}

export default InfoModal;
