import styles from './GradientButton.module.css'

const GradientButton = ({text, onClick}) => {
  return(
    <button onClick={onClick} className={styles.gradientButton}>{text}</button>
  )
}

export default GradientButton