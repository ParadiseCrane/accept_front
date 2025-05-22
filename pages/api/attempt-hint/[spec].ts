import { getCookieValue } from '@utils/cookies';
import { fetchWrapper } from '@utils/fetchWrapper';
import { getApiUrl } from '@utils/getServerUrl';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function GetAIHint(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // TODO поменять на нормальный запрос
  // await fetchWrapper({
  //   req: req,
  //   res: res,
  //   url: `api/attempt-hint/${req.query.spec}`,
  //   method: 'GET',
  // });

  await new Promise((resolve) => setTimeout(resolve, 3000));
  res
    .status(200)
    .json(
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam hendrerit, lectus et porttitor mollis, nunc lectus fermentum sapien, et porta urna justo in massa. Suspendisse potenti. Donec semper nisl luctus nisl egestas faucibus. Aliquam porta neque vel sapien imperdiet hendrerit. Nulla facilisi. Curabitur eget luctus diam. Suspendisse ut est porttitor, lacinia orci nec, fermentum arcu. Sed at varius urna. Etiam convallis dapibus tellus, mattis interdum diam viverra eu. Curabitur dictum purus eget interdum vestibulum. Donec sapien sem, luctus eget quam ac, lacinia suscipit lorem. Ut et egestas elit. Maecenas iaculis orci mi, eu dignissim nunc dictum et. Morbi tempor volutpat orci eget eleifend. Mauris commodo nibh neque.Duis consectetur, turpis lobortis dignissim rhoncus, magna nunc semper ipsum, ac rutrum eros nunc eget justo. Nunc sollicitudin at enim ut egestas. Sed feugiat sem sit amet eros mollis commodo. Pellentesque dui felis, hendrerit nec porta sit amet, consequat eget enim. Nullam venenatis neque sagittis libero tempus, a tempor quam consectetur. Donec nisi nisi, cursus ornare lacus in, elementum convallis justo. Suspendisse lacinia sem eu tincidunt commodo. Duis finibus mauris at lectus pretium, in dignissim leo auctor. Aenean libero velit, tincidunt nec massa ut, lobortis semper leo. Nullam facilisis leo vel enim laoreet.'
    );
}
