using System;
using EndlessRunner.Player;
using UnityEngine;
using UnityEngine.SceneManagement;

namespace EndlessRunner.Core
{
    public class GameManager : MonoBehaviour
    {
        public static GameManager Instance { get; private set; }

        [SerializeField] private float coinScoreValue = 5f;
        [SerializeField] private float distanceScoreFactor = 1f;
        [SerializeField] private float hoverboardCooldown = 10f;
        [SerializeField] private float hoverboardShieldDuration = 5f;

        private float _distance;
        private int _coins;
        private float _score;
        private int _scoreMultiplier = 1;
        private bool _isPlaying;
        private float _nextHoverboardReadyTime;

        public event Action OnStateChanged;
        public event Action OnHudChanged;

        public bool IsPlaying => _isPlaying;
        public float Score => _score;
        public int Coins => _coins;
        public int ScoreMultiplier => _scoreMultiplier;
        public float HoverboardShieldDuration => hoverboardShieldDuration;

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }

            Instance = this;
        }

        private void Start()
        {
            StartRun();
        }

        public void StartRun()
        {
            _distance = 0f;
            _coins = 0;
            _score = 0;
            _scoreMultiplier = 1;
            _isPlaying = true;
            Time.timeScale = 1f;
            OnStateChanged?.Invoke();
            OnHudChanged?.Invoke();
        }

        public void AddDistance(float amount)
        {
            if (!_isPlaying)
            {
                return;
            }

            _distance += amount;
            _score = _distance * distanceScoreFactor * _scoreMultiplier + _coins * coinScoreValue;
            OnHudChanged?.Invoke();
        }

        public void AddCoin(int amount = 1)
        {
            _coins += amount;
            _score = _distance * distanceScoreFactor * _scoreMultiplier + _coins * coinScoreValue;
            OnHudChanged?.Invoke();
        }

        public void SetMultiplier(int multiplier)
        {
            _scoreMultiplier = Mathf.Max(1, multiplier);
            OnHudChanged?.Invoke();
        }

        public bool TryUseHoverboard()
        {
            if (Time.time < _nextHoverboardReadyTime)
            {
                return false;
            }

            _nextHoverboardReadyTime = Time.time + hoverboardCooldown;
            return true;
        }

        public void Pause()
        {
            Time.timeScale = 0f;
            _isPlaying = false;
            OnStateChanged?.Invoke();
        }

        public void Resume()
        {
            Time.timeScale = 1f;
            _isPlaying = true;
            OnStateChanged?.Invoke();
        }

        public void GameOver()
        {
            _isPlaying = false;
            OnStateChanged?.Invoke();
        }

        public void Restart()
        {
            Time.timeScale = 1f;
            SceneManager.LoadScene(SceneManager.GetActiveScene().buildIndex);
        }
    }
}
