'use client'

import styles from '@/styles/pages/home/Home.module.css';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import { useState } from 'react';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import Autocomplete from '@/components/ui/autocomplete/Autocomplete';

export default function Home() {
  const [modalVisible, setModalVisible] = useState(false)
  const { vw, vh } = useWindowDimensions()

  const [selectedItem, setSelectedItem] = useState("Green")

  const list = [{ frenchTitle: "Jaune", englishTitle: "Yellow" }, { frenchTitle: "Vert", englishTitle: "Green" }, { frenchTitle: "Rouge", englishTitle: "Red" }, { frenchTitle: "Rose", englishTitle: "Pink" }, { frenchTitle: "Violet", englishTitle: "Purple" }]

  return (
    <div className="pageContent">
      <h2 className="pageTitle">
        Welcome home !!!
      </h2>

      <h3 className="pageSubtitle mt-medium">
        Hello !!!
      </h3>

      <button type="button" className='regularItem strongRedBg regularText mt-large' onClick={() => setModalVisible(true)}>
        Confirmation
      </button>

      <button className='mediumItem strongRedBg regularText mt-medium' onClick={() => setModalVisible(true)}>
        Confirmation - medium item
      </button>

      <button className='largeItem strongRedBg regularText mt-medium' onClick={() => setModalVisible(true)}>
        Confirmation - regular text
      </button>

      <button className='largeItem strongRedBg largeText mt-large' onClick={() => setModalVisible(true)}>
        Confirmation - large text
      </button>


      <ConfirmationModal visible={modalVisible} confirmationText={"Êtes vous sûr de vouloir gagner 1 million d'euros ?"} confirmationButtonText={"Oui je suis sûr"} cancelButtonText={"Non je préfère un chocolat"} confirmationFunction={() => setModalVisible(false)} closeModal={() => setModalVisible(false)} />

      <p className='regularText mt-large'>
        Un nouveau record pour cette carte, que l’Américain avait achetée 5,3 millions de dollars en 2021, soit trois fois moins. Lancées le 6 janvier, les enchères ont longtemps plafonné autour de 5,1 millions de dollars avant de s’envoler les dernières heures. L’identité de l’acheteur n’est, pour l’heure, pas connue, mais l’influenceur a d’ores et déjà promis de lui remettre en main propre.
      </p>



      <div className='largeCard'>
        <h3 className='pageSubtitle'>
          Modifier mes informations
        </h3>

        <p className='labelText mt-large'>Titre input - label text </p>

        <Autocomplete
          data={list}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          placeholderText={"Choisissez la couleur"}
          titleToSelectKey={"frenchTitle"}
          sectionToSelectKey={"englishTitle"}
          itemClass={"largeCardItem"}
          appearanceClass={"strongGreyBorder"}
          iconColor={"var(--placeholder-color)"}
        />

        <p className='largeText mt-medium'>Titre input - large text </p>

        <input className='largeCardItem regularText strongGreyBorder' />

        <p className='regularText mt-medium'>Titre input - regular text </p>

        <input className='largeCardItem regularText strongGreyBorder' />

        <button className='largeCardItem strongRedBg regularText' onClick={() => setModalVisible(true)}>
          Confirmation
        </button>

      </div>


    </div>
  );
}

