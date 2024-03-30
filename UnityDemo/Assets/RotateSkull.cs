using UnityEngine;

public class RotateSkull : MonoBehaviour
{
    public float speed = 72f;

    void Update()
    {
        transform.Rotate(new Vector3(0, 0, 1), speed * Time.deltaTime);
    }
}
