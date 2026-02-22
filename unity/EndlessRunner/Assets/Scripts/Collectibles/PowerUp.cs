using System.Collections;
using EndlessRunner.Core;
using EndlessRunner.Player;
using UnityEngine;

namespace EndlessRunner.Collectibles
{
    public class PowerUp : MonoBehaviour
    {
        public enum PowerUpType
        {
            CoinMagnet,
            Jetpack,
            SuperJump,
            ScoreMultiplier2x
        }

        [SerializeField] private PowerUpType type;
        [SerializeField] private float duration = 6f;
        [SerializeField] private float magnetRadius = 4f;
        [SerializeField] private float jumpMultiplier = 1.4f;

        private void OnTriggerEnter(Collider other)
        {
            if (!other.CompareTag("Player"))
            {
                return;
            }

            PlayerRunnerController player = other.GetComponent<PlayerRunnerController>();
            if (player == null)
            {
                return;
            }

            switch (type)
            {
                case PowerUpType.CoinMagnet:
                    StartCoroutine(CoinMagnetRoutine(other.transform));
                    break;
                case PowerUpType.Jetpack:
                    player.SetInvincible(duration);
                    break;
                case PowerUpType.SuperJump:
                    player.ApplyJumpBoost(jumpMultiplier, duration);
                    break;
                case PowerUpType.ScoreMultiplier2x:
                    StartCoroutine(ScoreMultiplierRoutine());
                    break;
            }

            gameObject.SetActive(false);
        }

        private IEnumerator CoinMagnetRoutine(Transform player)
        {
            float elapsed = 0f;
            while (elapsed < duration)
            {
                Collider[] hits = Physics.OverlapSphere(player.position, magnetRadius);
                foreach (Collider hit in hits)
                {
                    Coin coin = hit.GetComponent<Coin>();
                    if (coin != null)
                    {
                        coin.transform.position = Vector3.MoveTowards(coin.transform.position, player.position, 18f * Time.deltaTime);
                    }
                }

                elapsed += Time.deltaTime;
                yield return null;
            }
        }

        private IEnumerator ScoreMultiplierRoutine()
        {
            GameManager.Instance.SetMultiplier(2);
            yield return new WaitForSeconds(duration);
            GameManager.Instance.SetMultiplier(1);
        }
    }
}
