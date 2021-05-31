const router = require('express').Router();
const { Bird, Location, User } = require('../../models');

// for api/birds/

router.get('/', async (req, res) => {
    try {
      const dbBirdData = await Bird.findAll();

        res.status(200).json(dbBirdData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });

  router.get('/sightings/:id', async (req, res) => {
    try {
          const dbBirdData = await Bird.findByPk(req.params.id);
          const birdSimple = dbBirdData.get({ plain: true })

          const dbSightingsData = await Location.findAll()
          const sightingsPlain = dbSightingsData.map((sight) => sight.get({ plain: true }))

            const birdShipData = {
                id: birdSimple.id,
                bird_name: birdSimple.bird_name,
                coordinates: "N/A"
            }

            const birdCoordinates = []
          for (let i = 0; i < sightingsPlain.length; i++) {
              if (birdSimple.id === sightingsPlain[i].bird_id) {
                birdCoordinates.push(sightingsPlain[i].coordinates)
              } 
          }
          birdShipData.coordinates = birdCoordinates
          console.log(birdCoordinates)
          console.log(birdShipData)

          res.status(200).json(birdShipData);
      } catch (err) {
        console.log(err);
        res.status(500).json(err);
      }
    });

router.get('/names', async (req, res) => {
    try {
        const dbBirdData = await Bird.findAll();
        const birdPlain = dbBirdData.map((bird) => bird.get({ plain: true }))
        const namesList = []
        for (let i = 0; i < birdPlain.length; i++) {
            namesList.push(birdPlain[i].bird_name)
        }
        console.log(namesList)
        res.status(200).json(namesList);
    } catch {
        res.status(500).json(err);
    }
});

router.get('/:id', async (req, res) => {
try {
    const dbBirdData = await Bird.findByPk(req.params.id);

    if (!dbBirdData) {
    res.status(404).json({ message: 'No bird found with that id!' });
    return;
    }

    res.status(200).json(dbBirdData);
} catch (err) {
    res.status(500).json(err);
}
});

router.post('/', async (req, res) => {
    try { 
      const birdData = await Bird.create({
        bird_type: req.body.bird_type,
        bird_name: req.body.bird_name,
        latin_name: req.body.latin_name,
        max_age: req.body.max_age,
        weight: req.body.weight,
        description: req.body.description,
      });
      res.status(200).json(birdData);
    } catch (err) {
      res.status(400).json(err);
    }
  });

  // NEED HELP ON THIS SECTION
  // api/birds/sightings

  router.post('/sightings', async (req, res) => {
    try { 
        if (!req.session.user_id) throw err
        const birdData = await Bird.findAll();
        const birdPlain = birdData.map((bird) => bird.get({ plain: true })).filter((bird) => {
            // console.log(bird.bird_name, req.body.bird_name)
           return bird.bird_name === req.body.bird_name
        })
        console.log("req.session", req.session, birdPlain)
        console.log({
            bird_id: birdPlain[0].id, //won't work because not integer
            coordinates: req.body.coordinates,
    
            user_id: req.session.user_id
          })
      const locationData = await Location.create({
        bird_id: birdPlain[0].id, //won't work because not integer
        coordinates: req.body.coordinates,

        user_id: req.body.user_id //req.session.user_id
      });
      res.status(200).json(locationData);
    } catch (err) {
      res.status(400).json(err);
    }
  });


router.delete('/:id', async (req, res) => {
try {
    const birdData = await Bird.destroy({
    where: {
        id: req.params.id,
    },
    });

    if (!birdData) {
    res.status(404).json({ message: 'No bird found with that id!' });
    return;
    }

    res.status(200).json(categoryData);
} catch (err) {
    res.status(500).json(err);
}
});

module.exports = router;