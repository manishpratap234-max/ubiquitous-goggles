using EndlessRunner.Core;
using TMPro;
using UnityEngine;

namespace EndlessRunner.UI
{
    public class HudController : MonoBehaviour
    {
        [SerializeField] private TextMeshProUGUI scoreText;
        [SerializeField] private TextMeshProUGUI coinText;
        [SerializeField] private TextMeshProUGUI multiplierText;
        [SerializeField] private GameObject pausePanel;
        [SerializeField] private GameObject gameOverPanel;

        private void OnEnable()
        {
            GameManager.Instance.OnHudChanged += Refresh;
            GameManager.Instance.OnStateChanged += OnStateChanged;
            Refresh();
            OnStateChanged();
        }

        private void OnDisable()
        {
            if (GameManager.Instance == null)
            {
                return;
            }

            GameManager.Instance.OnHudChanged -= Refresh;
            GameManager.Instance.OnStateChanged -= OnStateChanged;
        }

        public void PausePressed()
        {
            GameManager.Instance.Pause();
        }

        public void ResumePressed()
        {
            GameManager.Instance.Resume();
        }

        public void RestartPressed()
        {
            GameManager.Instance.Restart();
        }

        private void Refresh()
        {
            scoreText.text = $"Score: {Mathf.RoundToInt(GameManager.Instance.Score)}";
            coinText.text = $"Coins: {GameManager.Instance.Coins}";
            multiplierText.text = $"x{GameManager.Instance.ScoreMultiplier}";
        }

        private void OnStateChanged()
        {
            bool playing = GameManager.Instance.IsPlaying;
            pausePanel.SetActive(!playing && Time.timeScale == 0f);
            gameOverPanel.SetActive(!playing && Time.timeScale > 0f);
        }
    }
}
