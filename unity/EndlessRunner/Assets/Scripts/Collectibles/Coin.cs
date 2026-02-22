using EndlessRunner.Core;
using UnityEngine;

namespace EndlessRunner.Collectibles
{
    public class Coin : MonoBehaviour
    {
        [SerializeField] private float rotateSpeed = 160f;
        [SerializeField] private AudioClip collectSfx;

        private void Update()
        {
            transform.Rotate(Vector3.up, rotateSpeed * Time.deltaTime, Space.World);
        }

        private void OnTriggerEnter(Collider other)
        {
            if (!other.CompareTag("Player"))
            {
                return;
            }

            GameManager.Instance.AddCoin();
            if (collectSfx != null)
            {
                AudioSource.PlayClipAtPoint(collectSfx, transform.position);
            }

            Destroy(gameObject);
        }
    }
}
