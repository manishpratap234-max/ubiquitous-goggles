using EndlessRunner.Core;
using UnityEngine;

namespace EndlessRunner.World
{
    public class MovingTrain : MonoBehaviour
    {
        [SerializeField] private float speed = 14f;
        [SerializeField] private float despawnDistance = 35f;

        private Transform _player;

        private void Start()
        {
            GameObject playerObj = GameObject.FindGameObjectWithTag("Player");
            if (playerObj != null)
            {
                _player = playerObj.transform;
            }
        }

        private void Update()
        {
            if (!GameManager.Instance.IsPlaying)
            {
                return;
            }

            transform.Translate(Vector3.back * (speed * Time.deltaTime), Space.World);

            if (_player != null && _player.position.z - transform.position.z > despawnDistance)
            {
                Destroy(gameObject);
            }
        }
    }
}
