using UnityEngine;

namespace EndlessRunner.Core
{
    public class Obstacle : MonoBehaviour
    {
        [SerializeField] private bool destroyOnBreak = true;
        [SerializeField] private GameObject breakFx;

        public void Break()
        {
            if (breakFx != null)
            {
                Instantiate(breakFx, transform.position, Quaternion.identity);
            }

            if (destroyOnBreak)
            {
                Destroy(gameObject);
            }
        }
    }
}
